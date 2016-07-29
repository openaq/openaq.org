'use strict';
import React from 'react';
import mapboxgl from 'mapbox-gl';
import config from '../config';
mapboxgl.accessToken = config.mapbox.token;

var MapComponent = React.createClass({
  displayName: 'MapComponent',

  propTypes: {
  },

  // The map element.
  map: null,

  componentDidMount: function () {
    this.map = new mapboxgl.Map({
      container: this.refs.map,
      style: config.mapbox.baseStyle
    });
  },

  render: function () {
    return (
      <div className='map-container' ref='map'>
        {/* Map renders on componentDidMount. */}
      </div>
    );
  }
});

module.exports = MapComponent;
