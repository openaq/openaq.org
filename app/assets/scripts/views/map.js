'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import c from 'classnames';
import _ from 'lodash';
import qs from 'qs';
import { Dropdown } from 'openaq-design-system';
import createReactClass from 'create-react-class';

import MapComponent from '../components/map';
import HeaderMessage from '../components/header-message';
import { fetchLatestMeasurements, invalidateAllLocationData } from '../actions/action-creators';
import { generateLegendStops } from '../utils/colors';
import config from '../config';
mapboxgl.accessToken = config.mapbox.token;

var Map = createReactClass({
  displayName: 'Map',

  propTypes: {
    location: T.object,

    _invalidateAllLocationData: T.func,
    _fetchLatestMeasurements: T.func,

    parameters: T.array,
    sources: T.array,

    latestMeasurements: T.shape({
      fetching: T.bool,
      fetched: T.bool,
      error: T.string,
      data: T.object
    })
  },

  // The map element.
  map: null,

  onFilterSelect: function (parameter, e) {
    e.preventDefault();
    this.props.history.push(`map?parameter=${parameter}`);
  },

  getActiveParameterData: function () {
    const query = qs.parse(this.props.location.search);
    let parameterData = _.find(this.props.parameters, {id: query.parameter});
    return parameterData || _.find(this.props.parameters, {id: 'pm25'});
  },

  componentDidMount: function () {
    this.props._invalidateAllLocationData();
    this.props._fetchLatestMeasurements({has_geo: 'true'});
  },

  renderMapLegend: function () {
    let activeParam = this.getActiveParameterData();
    let drop = (
      <Dropdown
        triggerElement='button'
        triggerClassName='button button--primary-unbounded drop__toggle--caret'
        triggerTitle='Show/hide parameter options'
        triggerText={activeParam.name} >

        <ul role='menu' className='drop__menu drop__menu--select'>
        {this.props.parameters.map(o => (
          <li key={o.id}>
            <a className={c('drop__menu-item', {'drop__menu-item--active': activeParam.id === o.id})} href='#' title={`Show values for ${o.name}`} data-hook='dropdown:close' onClick={this.onFilterSelect.bind(null, o.id)}><span>{o.name}</span></a>
          </li>
        ))}
        </ul>
      </Dropdown>
    );

    const scaleStops = generateLegendStops(activeParam.id);
    const colorWidth = 100 / scaleStops.length;

    return (
      <div>
        <p>Showing the most recent values for {drop}</p>
        <ul className='color-scale'>
          {scaleStops.map(o => (
            <li key={o.label} style={{'backgroundColor': o.color, width: `${colorWidth}%`}} className='color-scale__item'><span className='color-scale__value'>{o.label}</span></li>
          ))}
        </ul>
        <small className='disclaimer'><a href='https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85'>Data Disclaimer and More Information</a></small>
      </div>
    );
  },

  render: function () {
    let {fetched, fetching, error, data} = this.props.latestMeasurements;
    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return (
        <HeaderMessage>
          <h1>Take a deep breath</h1>
          <div className='prose prose--responsive'>
            <p>Map data is loading...</p>
          </div>
        </HeaderMessage>
      );
    }

    if (error) {
      return (
        <HeaderMessage>
          <h1>Uhoh, something went wrong</h1>
          <div className='prose prose--responsive'>
            <p>There was a problem getting the data. If the problem continues, please let us know.</p>
            <p><a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a></p>
          </div>
        </HeaderMessage>
      );
    }

    let activeParam = this.getActiveParameterData();

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
          <MapComponent
            center={[0, 0]}
            zoom={1}
            measurements={data.results}
            sources={this.props.sources}
            parameter={activeParam} >
            {this.renderMapLegend()}
          </MapComponent>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,
    latestMeasurements: state.latestMeasurements
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLatestMeasurements: (...args) => dispatch(fetchLatestMeasurements(...args)),
    _invalidateAllLocationData: (...args) => dispatch(invalidateAllLocationData(...args))
  };
}

module.exports = connect(selector, dispatcher)(Map);
