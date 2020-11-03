'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import qs from 'qs';
import moment from 'moment';
import { Link } from 'react-router-dom';
import createReactClass from 'create-react-class';

import config from '../../config';
import {
  fetchLocationIfNeeded,
  fetchLatestMeasurements,
  fetchMeasurements,
  invalidateAllLocationData,
  openDownloadModal
} from '../../actions/action-creators';
import HeaderMessage from '../../components/header-message';
import StatsInfo from './stats-info';
import Metadata from './metadata';
import SourceInfo from './source-info';
import ValuesBreakdown from './values-breakdown';
import NearbyLoc from './nearby-loc';

var Location = createReactClass({
  displayName: 'Location',

  propTypes: {
    params: T.object,
    location: T.object,
    _fetchLocationIfNeeded: T.func,
    _fetchLocations: T.func,
    _fetchLatestMeasurements: T.func,
    _fetchMeasurements: T.func,
    _invalidateAllLocationData: T.func,
    _openDownloadModal: T.func,

    countries: T.array,
    sources: T.array,
    parameters: T.array,

    countryData: T.object,

    loc: T.shape({
      fetching: T.bool,
      fetched: T.bool,
      error: T.string,
      data: T.object
    }),

    latestMeasurements: T.shape({
      fetching: T.bool,
      fetched: T.bool,
      error: T.string,
      data: T.object
    }),

    measurements: T.shape({
      fetching: T.bool,
      fetched: T.bool,
      error: T.string,
      data: T.object
    })
  },

  getInitialState: function () {
    return {
      modalDownloadOpen: false
    };
  },

  shouldFetchData: function (prevProps) {
    let prevLoc = prevProps.match.params.name;
    let currLoc = this.props.match.params.name;

    return prevLoc !== currLoc;
  },

  getActiveParameterData: function () {
    const query = qs.parse(this.props.location.search);
    let parameterData = _.find(this.props.parameters, {id: query.parameter});
    return parameterData || _.find(this.props.parameters, {id: 'pm25'});
  },

  //
  // Start event listeners
  //

  onFilterSelect: function (parameter) {
    this.props.history.push(`/location/${encodeURIComponent(this.props.match.params.name)}?parameter=${parameter}`);
  },

  onDownloadClick: function () {
    let d = this.props.loc.data;
    this.props._openDownloadModal({
      country: d.country,
      area: d.city,
      location: d.location
    });
  },

  //
  // Start life-cycle methods.
  //

  componentDidMount: function () {
    // Invalidate all the data related to the location page.
    // This is needed otherwise the system thinks there's data and
    // throws errors.
    this.props._invalidateAllLocationData();
    this.props._fetchLocationIfNeeded(this.props.match.params.name);
  },

  componentDidUpdate: function (prevProps) {
    if (this.shouldFetchData(prevProps)) {
      // Invalidate all the data related to the location page.
      // This is needed otherwise the system thinks there's data and
      // throws errors.
      this.props._invalidateAllLocationData();
      this.props._fetchLocationIfNeeded(this.props.match.params.name);
      return;
    }

    if (this.props.loc.fetched && !this.props.loc.fetching &&
      !this.props.latestMeasurements.fetched && !this.props.latestMeasurements.fetching &&
      !this.props.measurements.fetched && !this.props.measurements.fetching) {
      let loc = this.props.loc.data;

      // Get the measurements.
      let toDate = moment.utc();
      let fromDate = toDate.clone().subtract(8, 'days');
      // this.props._fetchLatestMeasurements({city: loc.city, has_geo: 'true'});
      if (loc.coordinates) {
        this.props._fetchLatestMeasurements({
          coordinates: `${loc.coordinates.latitude},${loc.coordinates.longitude}`,
          radius: 10 * 1000, // 10 Km
          has_geo: 'true'
        });
      } else {
        this.props._fetchLatestMeasurements({
          location: loc.location
        });
      }
      this.props._fetchMeasurements(loc.location, fromDate.toISOString(), toDate.toISOString());
    }
  },

  //
  // Start render methods.
  //

  render: function () {
    const { countryData } = this.props;
    let {fetched, fetching, error, data} = this.props.loc;
    if (!fetched && !fetching) {
      return null;
    }

    const country = countryData || {};

    if (fetching) {
      return (
        <HeaderMessage>
          <h1>Take a deep breath.</h1>
          <div className='prose prose--responsive'>
            <p>Location data is loading...</p>
          </div>
        </HeaderMessage>
      );
    }

    if (error) {
      return (
        <HeaderMessage>
          <h1>Uh oh, something went wrong.</h1>
          <div className='prose prose--responsive'>
            <p>There was a problem getting the data. If you continue to have problems, please let us know.</p>
            <p><a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a></p>
          </div>
        </HeaderMessage>
      );
    }
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <p className='inpage__subtitle'>location</p>
              <h1 className='inpage__title'>{data.location} <small>in {data.city}, {country.name}</small></h1>
              <ul className='ipha'>
                <li><a href={`${config.api}/locations?location=${data.location}`} title='View in API documentation' className='ipha-api' target='_blank'>View API</a></li>
                <li><button type='button' title='Download data for this location' className='ipha-download' onClick={this.onDownloadClick}>Download</button></li>
                <li><Link to={`/compare/${encodeURIComponent(data.location)}`} title='Compare location with another' className='ipha-compare ipha-main'><span>Compare</span></Link></li>
              </ul>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--home/cover--home.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>
          <StatsInfo
            latestMeasurements={this.props.latestMeasurements}
            measurements={this.props.measurements}
            loc={this.props.loc}
            parameters={this.props.parameters}
            />
          <Metadata loc={this.props.loc} />
          <SourceInfo
            sources={this.props.sources}
            measurements={this.props.measurements}
            loc={this.props.loc}
          />
          <ValuesBreakdown
            measurements={this.props.measurements}
            parameters={this.props.parameters}
            activeParam={this.getActiveParameterData()}
            onFilterSelect={this.onFilterSelect}
          />
          <NearbyLoc
            countryData={this.props.countryData}
            latestMeasurements={this.props.latestMeasurements}
            loc={this.props.loc}
            parameters={this.props.parameters}
            sources={this.props.sources} />
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,

    countryData: _.find(state.baseData.data.countries, {code: (state.location.data || {}).country}),

    loc: state.location,
    latestMeasurements: state.latestMeasurements,
    measurements: state.measurements
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLocationIfNeeded: (...args) => dispatch(fetchLocationIfNeeded(...args)),
    _fetchLatestMeasurements: (...args) => dispatch(fetchLatestMeasurements(...args)),
    _fetchMeasurements: (...args) => dispatch(fetchMeasurements(...args)),
    _invalidateAllLocationData: (...args) => dispatch(invalidateAllLocationData(...args)),

    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args))
  };
}

module.exports = connect(selector, dispatcher)(Location);
