'use strict';
import React from 'react';
import { render } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import _ from 'lodash';
import moment from 'moment';
import distance from 'turf-distance';

import { convertParamIfNeeded, circleOpacity, circleBlur,
         coloredCircleRadius, borderCircleRadius, selectCircleRadius, selectShadowCircleRadius } from '../utils/map-settings';
import { generateColorStops } from '../utils/colors';
// import  from '../utils/color-scale';

import config from '../config';
mapboxgl.accessToken = config.mapbox.token;

const MapComponent = React.createClass({
  displayName: 'MapComponent',

  propTypes: {
    measurements: React.PropTypes.array,
    highlightLoc: React.PropTypes.string,
    parameter: React.PropTypes.object,
    center: React.PropTypes.array,
    bbox: React.PropTypes.array,
    zoom: React.PropTypes.number,
    disableScrollZoom: React.PropTypes.bool,
    children: React.PropTypes.object
  },

  nearbyKm: 10,

  // The map element.
  map: null,

  popover: null,

  //
  // Start events methods
  //

  nearbyLocationClick: function (location, e) {
    e.preventDefault();
    let data = _.find(this.props.measurements, {location: location});
    this.map.panTo([data.coordinates.longitude, data.coordinates.latitude]);
    this.showPopover(data);
    this.selectPoint(this.generateFeature(data));
  },

  locationPageSetup: function () {
    let data = _.find(this.props.measurements, {location: this.props.highlightLoc});
    this.showPopover(data);
    this.selectPoint(this.generateFeature(data));
  },

  setupMapEvents: function () {
    // When a click event occurs near a place, open a popup at the location of
    // the feature, with description HTML from its properties.
    this.map.on('click', (e) => {
      let features = this.map.queryRenderedFeatures(e.point, { layers: ['measurements'] });

      if (!features.length) {
        // Unselect point.
        this.selectPoint(null);
        return;
      }

      // Popover.
      let data = _.find(this.props.measurements, {location: features[0].properties.location});
      this.showPopover(data);
      this.selectPoint(features[0].toJSON());
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
    this.map.on('mousemove', (e) => {
      let features = this.map.queryRenderedFeatures(e.point, { layers: ['measurements'] });
      this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });
  },

  showPopover: function (data) {
    let measurement = _.find(data.measurements, {parameter: this.props.parameter.id});

    // Find the nearby ones.
    let start = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          data.coordinates.longitude,
          data.coordinates.latitude
        ]
      }
    };

    let nearby = _(_.cloneDeep(this.props.measurements))
      .map(o => {
        let end = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              o.coordinates.longitude,
              o.coordinates.latitude
            ]
          }
        };
        o.distance = distance(start, end, 'kilometers');
        return o;
      })
      .sortBy('distance')
      .filter(o => o.distance !== 0 && o.distance <= this.nearbyKm)
      .take(2)
      .value();

    let popoverContent = document.createElement('div');
    render(<MapPopover
      location={data.location}
      measurement={measurement}
      parameter={this.props.parameter}
      nearbyKm={this.nearbyKm}
      nearby={nearby}
      nearbyClick={this.nearbyLocationClick} />, popoverContent);

    // Populate the popup and set its coordinates
    // based on the feature found.
    if (this.popover != null) {
      this.popover.remove();
    }

    this.popover = new mapboxgl.Popup({closeButton: false})
      .setLngLat([data.coordinates.longitude, data.coordinates.latitude])
      .setDOMContent(popoverContent)
      .addTo(this.map);
  },

  selectPoint: function (feature) {
    if (this.map.getSource('selectedPoint')) {
      this.map.getLayer('selectedPointShadow') && this.map.removeLayer('selectedPointShadow');
      this.map.getLayer('selectedPointHighlight') && this.map.removeLayer('selectedPointHighlight');
      this.map.getLayer('selectedPoint') && this.map.removeLayer('selectedPoint');
      this.map.getSource('selectedPoint') && this.map.removeSource('selectedPoint');
    }

    // Passing feature: null clears selection.
    if (feature === null) {
      return;
    }

    this.map.addSource('selectedPoint', {
      'type': 'geojson',
      'data': feature
    });
    // Add Shadow
    this.map.addLayer({
      'id': 'selectedPointShadow',
      'type': 'circle',
      'source': 'selectedPoint',
      'paint': {
        'circle-color': '#000',
        'circle-opacity': 0.3,
        'circle-radius': selectShadowCircleRadius,
        'circle-blur': 0.5,
        'circle-translate': [0.5, 0.5]
      }
    });
    // Add Highlight
    this.map.addLayer({
      'id': 'selectedPointHighlight',
      'type': 'circle',
      'source': 'selectedPoint',
      'paint': {
        'circle-color': '#fff',
        'circle-opacity': 1,
        'circle-radius': selectCircleRadius,
        'circle-blur': 0
      }
    });
    // Re-add fill by value
    this.map.addLayer({
      'id': 'selectedPoint',
      'type': 'circle',
      'source': 'selectedPoint',
      'paint': {
        'circle-color': {
          property: 'value',
          stops: generateColorStops(this.props.parameter.id)
          // replace with generateColorStops()
        },
        'circle-opacity': 1,
        'circle-radius': coloredCircleRadius,
        'circle-blur': 0
      }
    });
  },

  //
  // Start data methods
  //

  generateFeature: function (locMeasurement) {
    let param = _.find(locMeasurement.measurements, {parameter: this.props.parameter.id});

    let val = param ? convertParamIfNeeded(param) : -1;
    val = val < 0 ? -1 : val;

    return {
      type: 'Feature',
      properties: {
        location: locMeasurement.location,
        // Controls which color is applied to the point.
        // Needs to be the points measurement.
        value: val
      },
      geometry: {
        type: 'Point',
        coordinates: [
          locMeasurement.coordinates.longitude,
          locMeasurement.coordinates.latitude
        ]
      }
    };
  },

  generateSourceData: function () {
    return {
      type: 'FeatureCollection',
      features: this.props.measurements.map(o => this.generateFeature(o))
    };
  },

  setupMapData: function () {
    const source = this.generateSourceData();

    this.map.addSource('measurements', {
      'type': 'geojson',
      'data': source
    });

    // Layer for outline
    this.map.addLayer({
      'id': 'pointOutlines',
      'source': 'measurements',
      'type': 'circle',
      'paint': {
        'circle-color': {
          property: 'value',
          stops: generateColorStops(this.props.parameter.id, 'dark')
        },
        'circle-opacity': 1,
        'circle-radius': borderCircleRadius,
        'circle-blur': 0
      }
    });

    this.map.addLayer({
      'id': 'measurements',
      'source': 'measurements',
      'type': 'circle',
      'paint': {
        'circle-color': {
          property: 'value',
          stops: generateColorStops(this.props.parameter.id)
        },
        'circle-opacity': circleOpacity,
        'circle-radius': coloredCircleRadius,
        'circle-blur': circleBlur
      }
    });
  },

  //
  // Start life-cycle methods
  //

  componentDidUpdate: function (prevProps) {
    if (this.props.parameter.id !== prevProps.parameter.id) {
      // We need to update. Delete source + layers and setup again.
      this.map.getSource('measurements') && this.map.removeSource('measurements');
      this.map.getLayer('pointOutlines') && this.map.removeLayer('pointOutlines');
      this.map.getLayer('measurements') && this.map.removeLayer('measurements');
      this.setupMapData();
    }
  },

  componentDidMount: function () {
    if (!this.props.center && !this.props.bbox) {
      throw new Error('At least center or bbox has to be provided to MapComponent');
    }

    this.map = new mapboxgl.Map({
      container: this.refs.map,
      center: this.props.center || [0, 0],
      zoom: this.props.zoom,
      style: config.mapbox.baseStyle,
      maxBounds: [[-180, -84], [180, 84]]
    });

    if (this.props.bbox) {
      this.map.fitBounds([
        [this.props.bbox[0], this.props.bbox[1]],
        [this.props.bbox[2], this.props.bbox[3]]
      ]);
    }

    if (this.props.disableScrollZoom) {
      this.map.scrollZoom.disable();
      this.map.addControl(new mapboxgl.Navigation());
    }

    this.map.on('load', () => {
      this.setupMapData();
      this.setupMapEvents();
      // There is probably a better test for this if statement.
      if (this.props.highlightLoc) {
        this.locationPageSetup();
      }
    });
  },

  //
  // Start render methods
  //

  render: function () {
    return (
      <div className='map'>
        <div className='map__container' ref='map'>
          {/* Map renders on componentDidMount. */}
        </div>
        <div className='map__legend'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = MapComponent;

const MapPopover = React.createClass({
  displayName: 'MapPopover',

  propTypes: {
    location: React.PropTypes.string,
    measurement: React.PropTypes.object,
    parameter: React.PropTypes.object,
    nearbyKm: React.PropTypes.number,
    nearby: React.PropTypes.array,
    nearbyClick: React.PropTypes.func
  },

  renderNearby: function () {
    if (!this.props.nearby.length) {
      return <p>There are no locations within {this.props.nearbyKm}Km</p>;
    }

    return (
      <div>
        <p>Showing <strong>{this.props.nearby.length}</strong> other locations within {this.props.nearbyKm}km</p>
        <ul className='popover-nearby-loc'>
          {this.props.nearby.map(o => {
            let measurement = _.find(o.measurements, {parameter: this.props.parameter.id});
            return (
              <li key={o.location}>
                {measurement
                  ? <strong>{measurement.value} {measurement.unit}</strong>
                  : <strong>{this.props.parameter.name} N/A</strong>}
                <a onClick={this.props.nearbyClick.bind(null, o.location)} href='' title={`Open ${o.location} popover`}>{o.location}</a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },

  render: function () {
    let m = this.props.measurement;
    let reading = <p>{this.props.parameter.name} N/A</p>;
    if (m) {
      let lastUp = moment.utc(m.lastUpdated).format('YYYY/MM/DD HH:mm');
      reading = <p>Last reading <strong>{m.value}{m.unit}</strong> at <strong>{lastUp}</strong></p>;
    }

    return (
      <article className='popover'>
        <div className='popover__contents'>
          <header className='popover__header'>
            <h1 className='popover__title'><a href={`#/location/${this.props.location}`} title={`View ${this.props.location} page`}>{this.props.location}</a></h1>
          </header>
          <div className='popover__body'>
            {reading}
            <ul className='popover__actions'>
              <li><a href={``} className='button button--primary-bounded' title={`Compare ${this.props.location} with another location`}>Compare</a></li>
              <li><a href={`#/location/${this.props.location}`} title={`View ${this.props.location} page`}className='button button--primary-bounded'>View More</a></li>
            </ul>
          </div>
          <footer className='popover__footer'>
            {this.renderNearby()}
          </footer>
        </div>
      </article>
    );
  }
});
