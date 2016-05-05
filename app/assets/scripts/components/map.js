import React from 'react';
import ReactIntl from 'react-intl';
import Reflux from 'reflux';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';

import latestStore from '../stores/latest';
import actions from '../actions/actions';
import { generateColorScale } from '../utils';

let IntlMixin = ReactIntl.IntlMixin;
import Header from './header';
import Footer from './footer';
import config from '../config';
import Sidebar from './mapSidebar';
import MapLegend from './mapLegend';
let map;

// Map config
import { millisecondsToOld, colorScale as colors, parameterMax,
         parameterConversion, unusedColor, circleOpacity, circleBlur,
         coloredCircleRadius, unusedCircleRadius } from './mapConfig';

let Map = React.createClass({

  mixins: [
    IntlMixin,
    Reflux.listenTo(actions.latestValuesLoaded, '_onLatestValuesLoaded'),
    Reflux.listenTo(actions.mapParameterChanged, '_handleParamSwitch')
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      selectedParameter: 'pm25',
      selectedFeatures: [],
      selectedPoint: null,
      geojson: {}
    };
  },

  /**
  * Only interesting thing here is that we will init the map if we have the
  * needed data, otherwise, we assumed that the data callback will init the map,
  * this covers the case of navigating back to this page after data was
  * initially loaded.
  */
  componentDidMount: function () {
    mapboxgl.accessToken = config.mapboxToken;

    if (latestStore.storage.hasGeo[this.state.selectedParameter]) {
      this._mapInit();
    }
  },

  /**
   * Generates valid GeoJSON for map data based on component state and API data
   * @return {object} valid GeoJSON
   */
  _generateGeoJSON: function () {
    let geojson = {
      'type': 'FeatureCollection',
      'features': []
    };
    latestStore.storage.hasGeo[this.state.selectedParameter].forEach((l) => {
      // Handle conversion from ug/m3 to ppm for certain parameters here
      l.convertedValue = l.value;
      if (['co', 'so2', 'no2', 'o3'].indexOf(l.parameter) !== -1) {
        l.convertedValue = parameterConversion[l.parameter] * l.value;
      }
      let o = {
        'type': 'Feature',
        'properties': l,
        'geometry': {
          'type': 'Point',
          'coordinates': [l.coordinates.longitude, l.coordinates.latitude]
        }
      };
      geojson.features.push(o);
    });

    return geojson;
  },

  /**
   * Initializes the map and binds events, should be called once per component
   * mounting.
   */
  _mapInit: function () {
    let _this = this;
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v8',
      center: [0, 0],
      zoom: 1
    });
    // disable map rotation
    map.dragRotate.disable();

    map.on('style.load', function () {
      // Add initial data
      let markers = _this._generateGeoJSON();
      _this.setState({
        geojson: markers
      });
      map.addSource('markers', {
        'type': 'geojson',
        'data': markers
      });

      // Add main data layer
      map.addLayer({
        'id': 'markers',
        'interactive': true,
        'type': 'circle',
        'source': 'markers',
        'paint': {
          'circle-color': {
            property: 'convertedValue',
            stops: _this._generateColorStops()
          },
          'circle-opacity': circleOpacity,
          'circle-radius': coloredCircleRadius,
          'circle-blur': circleBlur
        },
        'filter': _this._generateFilter()
      });

      // And a special layer just for unused data
      map.addLayer({
        'id': 'unused-data',
        'interactive': false,
        'type': 'circle',
        'source': 'markers',
        'paint': {
          'circle-color': unusedColor,
          'circle-opacity': circleOpacity,
          'circle-radius': unusedCircleRadius,
          'circle-blur': circleBlur
        },
        filter: _this._generateUnusedFilter()
      });
    });

    // Open sidebar when we have items to show.
    map.on('click', function (e) {
      _this.setState({
        selectedPoint: e.point
      }, function () {
        _this._getFeatures();
      });
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
    map.on('mousemove', function (e) {
      const features = map.queryRenderedFeatures(e.point, {layers: ['markers']});
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });
  },

  /**
   * Generate the color stops needed for the map circls
   */
  _generateColorStops: function () {
    const colorScale = generateColorScale(latestStore.storage.hasGeo[this.state.selectedParameter], parameterMax[this.state.selectedParameter]);
    let stops = colors.map((c) => {
      return [colorScale.invertExtent(c)[0], c];
    });

    // And add one stop to the beginning to account for interpolation
    stops.unshift([-1, unusedColor]);

    return stops;
  },

  /*
  * Get the features for parameter and update the sidebar
  */
  _getFeatures: function () {
    if (!this.state.selectedPoint) {
      return;
    }
    const features = map.queryRenderedFeatures(this.state.selectedPoint, {layers: ['markers']});
    this.setState({
      selectedFeatures: features
    });
  },

  /*
   * Generate the filter for unused data
   * Filters out old items or values < 0
   * @return {array} A filter array
   */
  _generateUnusedFilter: function () {
    return [ 'any',
      [ '>', 'lastUpdatedMilliseconds', millisecondsToOld ],
      [ '<', 'convertedValue', 0 ]
    ];
  },

  /*
   * Generate the filter we want to use for the data, cuts out old data
   * @return {array} A mapbox-gl filter
   */
  _generateFilter: function () {
    return [ '<=', 'lastUpdatedMilliseconds', millisecondsToOld ];
  },

  /**
   * Updating the data based on current state.
   */
  _updateData: function () {
    this.setState({
      geojson: this._generateGeoJSON()
    }, () => {
      // Update data source
      map.getSource('markers').setData(this.state.geojson);

      // Update style for colored markers to apply new color stops
      const circleColor = {
        property: 'convertedValue',
        stops: this._generateColorStops()
      };
      map.setPaintProperty('markers', 'circle-color', circleColor);
    });
  },

  /**
   * Handler for action when data is loaded from API, will init the map
   */
  _onLatestValuesLoaded: function () {
    this._mapInit();
  },

  /**
   * Handler for switching of the selected parameter, updates state and data
   * @param {object} e associated event
   */
  _handleParamSwitch: function (data) {
    let _this = this;
    // This gets a bit weird since we need to wait for all the map data
    // to be loaded before grabbing new features.
    var getFeaturesIfLoaded = function () {
      if (!map.loaded()) {
        setTimeout(function () { getFeaturesIfLoaded(); }, 50);
      } else {
        // A timeout to wait for map to finish rendering before getting features
        setTimeout(function () { _this._getFeatures(); }, 150);
      }
    };

    this.setState({
      selectedParameter: data.parameter
    }, function () {
      this._updateData();
      getFeaturesIfLoaded();
    });
  },

  /**
   * Main render function, draws everything
   */
  render: function () {
    // Class for no map case
    let noMapClass = classnames('no-map', {'hidden': mapboxgl.supported({failIfMajorPerformanceCaveat: true})});
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='no-logo' />
        <div className='map page'>
          <div id='map'></div>
          <Sidebar
            locales={this.props.locales}
            messages={this.props.messages}
            features={this.state.selectedFeatures}
          />
          <MapLegend data={this.state.geojson} parameter={this.state.selectedParameter} />
          <div className={noMapClass}>
            <p>
              Unfortunately, the map is not available due to your current computer configuration.
              Trying with a more modern browser may resolve the situation.
            </p>
          </div>
        </div>
        <Footer locales={this.props.locales} messages={this.props.messages} style='bottom' />
      </div>
    );
  }
});

module.exports = Map;
