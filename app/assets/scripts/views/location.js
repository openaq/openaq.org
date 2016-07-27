'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { fetchLocationIfNeeded, fetchLocations } from '../actions/action-creators';
import HeaderMessage from '../components/header-message';
import InfoMessage from '../components/info-message';

var Location = React.createClass({
  displayName: 'Location',

  propTypes: {
    params: React.PropTypes.object,
    _fetchLocationIfNeeded: React.PropTypes.func,
    _fetchLocations: React.PropTypes.func,

    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array,

    countryData: React.PropTypes.object,

    locFetching: React.PropTypes.bool,
    locFetched: React.PropTypes.bool,
    locError: React.PropTypes.string,
    locData: React.PropTypes.object,

    locsFetching: React.PropTypes.bool,
    locsFetched: React.PropTypes.bool,
    locsError: React.PropTypes.string,
    locations: React.PropTypes.array
  },

  shouldFetchData: function (prevProps) {
    let prevLoc = prevProps.params.name;
    let currLoc = this.props.params.name;

    return prevLoc !== currLoc;
  },

  //
  // Start life-cycle methods.
  //

  componentDidMount: function () {
    this.props._fetchLocationIfNeeded(this.props.params.name);
  },

  componentDidUpdate: function (prevProps) {
    this.shouldFetchData(prevProps) && this.props._fetchLocationIfNeeded(this.props.params.name);

    if (this.props.locFetched && !this.props.locFetching && !this.props.locsFetched && !this.props.locsFetching) {
      // Got the location data, need to get the locations nearby.
      let loc = this.props.locData;
      this.props._fetchLocations(1, {
        city: loc.city,
        country: loc.country
      }, 100);
    }
  },

  //
  // Start render methods.
  //

  renderStatsInfo: function () {
    let data = this.props.locData;

    let sDate = moment(data.firstUpdated).format('YYYY/MM/DD');
    let eDate = moment(data.lastUpdated).format('YYYY/MM/DD');

    let lng = Math.floor(data.coordinates.longitude * 1000) / 1000;
    let lat = Math.floor(data.coordinates.latitude * 1000) / 1000;

    return (
      <section className='fold' id='location-stats'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Stats information</h1>
          </header>
          <div className='fold__body'>
            <div className='col-main'>
              <dl>
                <dt>Measurements</dt>
                <dd>30,665</dd>
                <dt>Collection Dates</dt>
                <dd>{sDate} - {eDate}</dd>
                <dt>Coordinates</dt>
                <dd>N{lat}, E{lng}</dd>
              </dl>
            </div>
            <div className='col-sec'>
              <p className='heading-alt'>Latest Measurements:</p>
              <ul className='measurements-list'>
                <li><strong>CO</strong> 32ug/m3 at 2016/06/17 4:05pm</li>
                <li><strong>SO2</strong> 32ug/m3 at 2016/06/17 4:05pm</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  },

  renderSourceInfo: function () {
    let source = _.find(this.props.sources, {name: this.props.locData.sourceName});

    return (
      <section className='fold fold--filled' id='location-source'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Source information</h1>
          </header>
          <div className='fold__body'>
            <div className='col-main'>
              <p>Source: <a href={source.sourceURL} title='View source information'>{source.name}</a></p>
            </div>
            <div className='col-sec'>
              {source.description
                ? <p>{source.description}</p>
                : null}
              For more information contact <a href={`mailto:${source.contacts[0]}`}>{source.contacts[0]}</a>.
            </div>
          </div>
        </div>
      </section>
    );
  },

  renderNearbyLoc: function () {
    let {locsFetched: fetched, locsFetching: fetching, locsError: error, locations} = this.props;
    if (!fetched && !fetching) {
      return null;
    }

    let intro = null;
    let content = null;

    if (fetching) {
      intro = <p>Fetching the data</p>;
    } else if (error) {
      intro = <p>We couldn't get any nearby locations.</p>;
      content = (
        <InfoMessage>
          <p>Please try again later.</p>
          <p>If you think there's a problem <a href='#' title='Contact openaq'>contact us.</a></p>
        </InfoMessage>
      );
    } else {
      if (locations.length === 1) {
        intro = <p>There are no other locations in {this.props.locData.city}, {this.props.countryData.name}.</p>;
      } else {
        intro = <p>There are <strong>{locations.length - 1}</strong> other locations in {this.props.locData.city}, {this.props.countryData.name}.</p>;
      }
      content = locations.map(o => <p>{o.location}</p>);
    }

    return (
      <section className='fold'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Nearby locations</h1>
            <div className='fold__introduction prose prose--responsive'>
              {intro}
            </div>
          </header>
          <div className='fold__body'>
            {content}
          </div>
        </div>
      </section>
    );
  },

  render: function () {
    let {locFetched: fetched, locFetching: fetching, locError: error, locData: data} = this.props;
    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return (
        <HeaderMessage>
          <h2>Take a deep breath.</h2>
          <p>Location data is loading...</p>
        </HeaderMessage>
      );
    }

    if (error) {
      return (
        <HeaderMessage>
          <h2>Uhoh, something went wrong</h2>
          <p>There was a problem getting the data. If the problem persists let us know.</p>
          <a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a>
        </HeaderMessage>
      );
    }

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{data.location} <small>in {data.city}, {this.props.countryData.name}</small></h1>
              <div className='inpage__introduction'>
                <p>Good things come to those who wait...</p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          {this.renderStatsInfo()}
          {this.renderSourceInfo()}

          <section className='fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Values breakdown</h1>
              </header>
              <div className='fold__body'>
                coming soon...
              </div>
            </div>
          </section>

          {this.renderNearbyLoc()}

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

    locFetching: state.location.fetching,
    locFetched: state.location.fetched,
    locError: state.location.error,
    locData: state.location.data,

    locsFetching: state.locations.fetching,
    locsFetched: state.locations.fetched,
    locsError: state.locations.error,
    locations: state.locations.data.results
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLocationIfNeeded: (...args) => dispatch(fetchLocationIfNeeded(...args)),
    _fetchLocations: (...args) => dispatch(fetchLocations(...args))
  };
}

module.exports = connect(selector, dispatcher)(Location);
