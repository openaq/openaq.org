'use strict';
import React from 'react';
import { connect } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import c from 'classnames';
import _ from 'lodash';
import { Dropdown } from 'openaq-design-system';
import { hashHistory } from 'react-router';

import MapComponent from '../components/map';
import HeaderMessage from '../components/header-message';
import { fetchLatestMeasurements, invalidateAllLocationData } from '../actions/action-creators';
import { generateLegendStops } from '../utils/colors';
import config from '../config';
mapboxgl.accessToken = config.mapbox.token;

var Map = React.createClass({
  displayName: 'Map',

  propTypes: {
    location: React.PropTypes.object,

    _invalidateAllLocationData: React.PropTypes.func,
    _fetchLatestMeasurements: React.PropTypes.func,

    parameters: React.PropTypes.array,

    latestMeasurements: React.PropTypes.shape({
      fetching: React.PropTypes.bool,
      fetched: React.PropTypes.bool,
      error: React.PropTypes.string,
      data: React.PropTypes.object
    })
  },

  // The map element.
  map: null,

  onFilterSelect: function (parameter, e) {
    e.preventDefault();
    hashHistory.push(`map?parameter=${parameter}`);
  },

  getActiveParameterData: function () {
    let parameter = this.props.location.query.parameter;
    let parameterData = _.find(this.props.parameters, {id: parameter});
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
          <h2>Take a deep breath.</h2>
          <p>Map data is loading...</p>
        </HeaderMessage>
      );
    }

    if (error) {
      return (
        <HeaderMessage>
          <h2>Uhoh, something went wrong</h2>
          <p>There was a problem getting the data. If the problem continues, please let us know.</p>
          <a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a>
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
