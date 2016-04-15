import React from 'react';
import ReactIntl from 'react-intl';
import Reflux from 'reflux';
import mapboxgl from 'mapbox-gl';

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
let relevantLayers = [];

// Map config
import { millisecondsToOld, colorScale as colors, parameterMax, parameterUnit } from './mapConfig';

let Map = React.createClass({

  mixins: [
    IntlMixin,
    Reflux.listenTo(actions.latestValuesLoaded, '_onLatestValuesLoaded'),
    Reflux.listenTo(actions.closeMapSidebar, '_onSidebarClosed'),
    Reflux.listenTo(actions.mapParameterChanged, '_handleParamSwitch')
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      selectedParameter: 'pm25',
      displaySidebar: false,
      selectedFeatures: [],
      selectedPoint: null
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
      center: [0, 0],
      zoom: 1
    });
    // disable map rotation
    map.dragRotate.disable();

    map.on('style.load', function () {
      // Add initial data
      let markers = _this._generateGeoJSON();
      map.addSource('markers', {
        'type': 'geojson',
        'data': markers
      });

      // Add filtered layers
      let filters = _this._generateFilters();
      for (let i = 0; i < filters.length; i++) {
        const layerID = `markers-${i}`;
        relevantLayers.push(layerID);
        map.addLayer({
          'id': layerID,
          'interactive': true,
          'type': 'circle',
          'source': 'markers',
          'paint': {
            'circle-color': colors[i],
            'circle-opacity': {
              'stops': [[0, 0.8], [7, 0.6], [11, 0.4]]
            },
            'circle-radius': {
              'stops': [[0, 2], [5, 5], [7, 8]]
            },
            'circle-blur': {
              'stops': [[0, 0.8], [5, 0.5], [7, 0]]
            }
          },
          filter: filters[i]
        });
      }

      // And a special layer just for unused data
      map.addLayer({
        'id': 'unused-data',
        'interactive': false,
        'type': 'circle',
        'source': 'markers',
        'paint': {
          'circle-color': '#B3B3B3',
          'circle-opacity': {
            'stops': [[0, 0.8], [7, 0.6], [11, 0.4]]
          },
          'circle-radius': {
            'stops': [[0, 2], [5, 5], [7, 8]]
          },
          'circle-blur': {
            'stops': [[0, 0.8], [5, 0.5], [7, 0]]
          }
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
      const features = map.queryRenderedFeatures(e.point, {layers: relevantLayers});
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });
  },

  /*
  * Get the features for parameter and update the sidebar
  */
  _getFeatures: function () {
    if (!this.state.selectedPoint) {
      return;
    }
    const features = map.queryRenderedFeatures(this.state.selectedPoint, {layers: relevantLayers});
    this.setState({
      selectedFeatures: features,
      displaySidebar: true
    });
  },

  /*
   * Generate the filter for unused data
   * Filters out old items, items with wrong unit or values < 0
   * @return {array} A filter array
   */
  _generateUnusedFilter: function () {
    // Depending on parameter, chose a desired unit to display
    const unit = parameterUnit[this.state.selectedParameter];

    return [ 'any',
      [ '>', 'lastUpdatedMilliseconds', millisecondsToOld ],
      [ '!=', 'unit', unit ],
      [ '<', 'value', 0 ]
    ];
  },

  /*
   * Generate the filters we want to use for the data, dependent on data
   * @return {array} An array of filter arrays
   */
  _generateFilters: function () {
    // Generate color scale for colors and extents
    const colorScale = generateColorScale(latestStore.storage.hasGeo[this.state.selectedParameter], parameterMax[this.state.selectedParameter]);

    // Depending on parameter, chose a desired unit to display
    const unit = parameterUnit[this.state.selectedParameter];

    let arr = [];
    for (let p = 0; p < colors.length; p++) {
      let filters;
      const b = colorScale.invertExtent(colors[p]);
      if (p < colors.length - 1) {
        filters = [ 'all',
          [ '>=', 'value', b[0] ],
          [ '<', 'value', b[1] ],
          [ '<=', 'lastUpdatedMilliseconds', millisecondsToOld ],
          [ '==', 'unit', unit ],
          [ '>=', 'value', 0 ]
        ];
      } else {
        filters = [ 'all',
          [ '>=', 'value', b[0] ],
          [ '<=', 'lastUpdatedMilliseconds', millisecondsToOld ],
          [ '==', 'unit', unit ],
          [ '>=', 'value', 0 ]
        ];
      }

      arr.push(filters);
    }

    return arr;
  },

  /**
   * Updating the data based on current state, will remove present layers and
   * sources and add new ones.
   * @todo move some of this logic to another function so we can do
   * source.setData and layer.setFilter instead of removing and adding
   * @todo use https://www.mapbox.com/mapbox-gl-style-spec/#types-function for
   * zoom-level circle-radius
   */
  _updateData: function () {
    let markers = this._generateGeoJSON();
    // Update data source
    map.getSource('markers').setData(markers);

    // Add filtered layers
    let filters = this._generateFilters();
    for (let i = 0; i < filters.length; i++) {
      map.setFilter(`markers-${i}`, filters[i]);
    }
    map.setFilter('unused-data', this._generateUnusedFilter());
  },

  /**
   * Handler for action when data is loaded from API, will init the map
   */
  _onLatestValuesLoaded: function () {
    this._mapInit();
  },

  _onSidebarClosed: function () {
    this.setState({
      displaySidebar: !this.state.displaySidebar
    });
  },

  /**
   * Handler for switching of the selected parameter, updates state and data
   * @param {object} e associated event
   */
  _handleParamSwitch: function (data) {
    let _this = this;
    // Set new selected parameter and then update data

    // This gets a bit weird since we need to wait for all the map data
    // to be loaded before grabbing new features.
    var getFeaturesIfLoaded = function () {
      if (!map.loaded()) {
        setTimeout(function () { getFeaturesIfLoaded(); }, 50);
      } else {
        setTimeout(function () { _this._getFeatures(); }, 100);
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
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='no-logo' />
        <div className='home page'>
          <div id='map'></div>
          <Sidebar
            locales={this.props.locales}
            messages={this.props.messages}
            features={this.state.selectedFeatures}
            parameter={this.state.selectedParameter}
            displaySidebar={this.state.displaySidebar}
          />
          <MapLegend />
        </div>
        <Footer locales={this.props.locales} messages={this.props.messages} style='bottom' />
      </div>
    );
  }
});

module.exports = Map;
