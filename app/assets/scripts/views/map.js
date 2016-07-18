'use strict';
import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import config from '../config';
mapboxgl.accessToken = config.mapbox.token;

var Map = React.createClass({
  displayName: 'Map',

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
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Map</h1>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='map-container' ref='map'>
            {/* Map renders on componentDidMount. */}
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(Map);
