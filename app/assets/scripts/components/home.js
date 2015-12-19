import React from 'react';
import ReactIntl from 'react-intl';
import Reflux from 'reflux';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';

import latestStore from '../stores/latest';
import actions from '../actions/actions';

let IntlMixin = ReactIntl.IntlMixin;
import Header from './header';
import config from '../config';
import Popup from './mapPopup';
let map;

// These are the visual breaks for the 6 severity groupings.
let breaks = {
  'pm25': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019']
  },
  'pm10': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019']
  },
  'co': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019']
  },
  'so2': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019']
  },
  'no2': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019']
  },
  'o3': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019']
  },
  'bc': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019']
  }
};
let defaultCircleOpacity = 0.4;
let defaultCircleRadius = 2;
let zoomedInCircleOpacity = 0.8;
let zoomedInCircleRadius = 6;
let zoomChange = 5; // Zoom level at which we make circles larger
let millisecondsToOld = 6 * 60 * 60 * 1000; // 6 hours

let Home = React.createClass({

  mixins: [
    IntlMixin,
    Reflux.listenTo(actions.latestValuesLoaded, '_onLatestValuesLoaded'),
    Reflux.listenTo(actions.closeMapPopup, '_onPopupClosed')
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      selectedParameter: 'pm25',
      mapZoom: 1,
      mapCenter: [-77.04, 38.907],
      circleRadius: defaultCircleRadius,
      circleOpactiy: defaultCircleOpacity,
      displayPopup: false,
      selectedFeatures: [{properties: {}}]
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
    _.forEach(latestStore.storage.hasGeo[this.state.selectedParameter], function (l) {
      // Make sure we have lat/lon
      if (l.coordinates) {
        let o = {
          'type': 'Feature',
          'properties': l,
          'geometry': {
            'type': 'Point',
            'coordinates': [l.coordinates.longitude, l.coordinates.latitude]
          }
        };
        geojson.features.push(o);
      }
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
      center: this.state.mapCenter,
      zoom: this.state.mapZoom
    });
    // disable map rotation
    map.dragRotate.disable();

    map.on('style.load', function () {
      _this._updateData();
    });

    // When a click event occurs near a marker icon, open a popup at the location of
    // the feature, with description HTML from its properties.
    map.on('click', function (e) {
      map.featuresAt(e.point, {radius: 10, includeGeometry: true}, function (err, features) {
        if (err || !features.length) {
          return;
        }

        _this.setState({
          selectedFeatures: features,
          displayPopup: true
        });
      });
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
    map.on('mousemove', function (e) {
      map.featuresAt(e.point, {radius: 10}, function (err, features) {
        map.getCanvas().style.cursor = (!err && features.length) ? 'pointer' : '';
      });
    });

    // We want to redraw circles at different zooms, handle that here
    map.on('moveend', function (e) {
      // Change circle size at a certain zoom level
      let circleRadius = defaultCircleRadius;
      let circleOpacity = defaultCircleOpacity;
      if (map.getZoom() >= zoomChange) {
        circleRadius = zoomedInCircleRadius;
        circleOpacity = zoomedInCircleOpacity;
      }
      // Check here to see if we're changing radius, hence if we need to redraw
      let dataUpdateRequired = _this.state.circleRadius !== circleRadius;
      _this.setState({
        circleRadius: circleRadius,
        circleOpacity: circleOpacity
      }, function () {
        if (dataUpdateRequired) {
          _this._updateData();
        }
      });
    });
  },

  /**
   * Generate HTML for popup given selected features
   * @param {array} features Array of selected features
   * @return {string} HTML to display
   */
  _generatePopupHTML: function (features) {
    let div = function (feature) {
      return `<div>
                  Location: ${feature.properties.location}<br/>
                  Time: ${feature.properties.lastUpdated}<br/>
                  Value: ${feature.properties.value} ${feature.properties.unit}
              </div>
              <hr/>`;
    };

    let html = '';
    _.forEach(features, function (f) {
      html += div(f);
    });

    return html;
  },

  /**
   * Updating the data based on current state, will remove present layers and
   * sources and add new ones.
   */
  _updateData: function () {
    let markers = this._generateGeoJSON();
    // Try removing old data source before adding new one
    try {
      map.removeSource('markers');
    } catch (e) {}
    map.addSource('markers', {
        'type': 'geojson',
        'data': markers
    });

    // Add filtered layers
    let bs = breaks[this.state.selectedParameter];
    for (let p = 0; p < bs.massValues.length; p++) {
      let filters;
      if (p < bs.massValues.length - 1) {
        filters = [ 'all',
          [ '>=', 'value', bs.massValues[p] ],
          [ '<', 'value', bs.massValues[p + 1] ],
          [ '<=', 'lastUpdatedMilliseconds', millisecondsToOld]
        ];
      } else {
        filters = [ 'all',
          [ '>=', 'value', bs.massValues[p] ],
          [ '<=', 'lastUpdatedMilliseconds', millisecondsToOld]
        ];
      }
      // Try and move previous layer before adding new one
      try {
        map.removeLayer(`markers-${bs.massValues[p]}`);
      } catch (e) {}
      map.addLayer({
          'id': `markers-${bs.massValues[p]}`,
          'interactive': true,
          'type': 'circle',
          'source': 'markers',
          'paint': {
              'circle-color': bs.colors[p],
              'circle-opacity': this.state.circleOpacity,
              'circle-radius': this.state.circleRadius
          },
          filter: filters
      });
    }
  },

  /**
   * Handler for action when data is loaded from API, will init the map
   */
  _onLatestValuesLoaded: function () {
    this._mapInit();
  },

  _onPopupClosed: function () {
    this.setState({
      displayPopup: false
    });
  },

  /**
   * Handler for switching of the selected paramter, updates state and data
   * @param {object} e associated event
   */
  _handleParamSwitch: function (e) {
    // Set new selected paramter and then update data
    this.setState({
      selectedParameter: e.target.value
    }, function () {
      this._updateData();
    });
  },

  /**
   * Main render function, draws everything
   */
  render: function () {
    // Include the popup or not
    var popup;
    if (this.state.displayPopup) {
      popup = <Popup locales={this.props.locales} messages={this.props.messages} features={this.state.selectedFeatures} parameter={this.state.selectedParameter} />;
    }
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='no-logo' />
        <div className='home page'>
          <div id='map'></div>
          {popup}
          <input type='radio' name='paramSwitcher' value='pm25' onChange={this._handleParamSwitch} checked={this.state.selectedParameter === 'pm25'} />PM2.5
          <input type='radio' name='paramSwitcher' value='pm10' onChange={this._handleParamSwitch} checked={this.state.selectedParameter === 'pm10'} />PM10
          <input type='radio' name='paramSwitcher' value='o3' onChange={this._handleParamSwitch} checked={this.state.selectedParameter === 'o3'} />Ozone
          <input type='radio' name='paramSwitcher' value='so2' onChange={this._handleParamSwitch} checked={this.state.selectedParameter === 'so2'} />SO2
          <input type='radio' name='paramSwitcher' value='no2' onChange={this._handleParamSwitch} checked={this.state.selectedParameter === 'no2'} />NO2
          <input type='radio' name='paramSwitcher' value='co' onChange={this._handleParamSwitch} checked={this.state.selectedParameter === 'co'} />CO
        </div>
      </div>
    );
  }
});

module.exports = Home;
