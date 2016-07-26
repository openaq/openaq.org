'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { formatThousands } from '../utils/format';
import NearbyLocations from '../components/nearby-locations';
import CommunityCard from '../components/community-card';
import { fetchBaseStats, geolocateUser, fetchNearbyLocations } from '../actions/action-creators';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    _fetchBaseStats: React.PropTypes.func,
    _geolocateUser: React.PropTypes.func,
    _fetchNearbyLocations: React.PropTypes.func,
    statsCounts: React.PropTypes.object,
    statsCountsFetching: React.PropTypes.bool,
    statsCountsFetched: React.PropTypes.bool,

    geolocationRequesting: React.PropTypes.bool,
    geolocationRequested: React.PropTypes.bool,
    geolocationError: React.PropTypes.string,
    geolocationCoords: React.PropTypes.object,

    locFetching: React.PropTypes.bool,
    locFetched: React.PropTypes.bool,
    locError: React.PropTypes.string,
    locations: React.PropTypes.array,
    locPagination: React.PropTypes.object,

    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array
  },

  //
  // Start life-cycle methods
  //
  componentDidMount: function () {
    this.props._fetchBaseStats();
  },

  //
  // Start render methods
  //

  renderStatsCount: function () {
    let {statsCountsFetching: fetched, statsCountsFetched: fetching, statsCounts: data} = this.props;

    if (!fetched && !fetching) {
      return null;
    }

    return (
      <section className='fold fold--filled' id='home-stats'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Our data</h1>
            <div className='fold__introduction prose prose--responsive'>
              {fetching
                ? (<p>OpenAQ has collected <strong>{formatThousands(data.measurements)}</strong> air quality measurements from <strong>{formatThousands(data.locations)}</strong> locations in <strong>{formatThousands(data.countries)}</strong> countries. Data is aggregated from <strong>{formatThousands(data.sources)}</strong> sources.</p>)
                : <p>Computing the stats for you.</p>}
            </div>
          </header>
        </div>
      </section>
    );
  },

  renderCommunity: function () {
    return (
      <section className='fold' id='home-community'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Join our community</h1>
            <div className='fold__introduction prose prose--responsive'>
              <p>Developers, Scientists and Researchers are all using our data in interesting ways.</p>
            </div>
          </header>
          <div className='fold__body'>

            <CommunityCard
              title='Build an App'
              linkTitle='View this community contribution'
              url=''
              imageNode={<img width='256' height='256' src='http://placehold.it/256x256' alt='Card thumb' />} >
              <p>To engage with his community on air quality issues in New Delhi, Amrit Sharma has built a free air quality app.</p>
            </CommunityCard>

          </div>
          <div className='fold__footer'>
            <Link to='/community' title='See community page' className='button button--primary-bounded button--semi-fluid'>Get Involved</Link>
          </div>
        </div>
      </section>
    );
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><em>Open, Real-time</em> Air Quality Data</h1>
              <div className='inpage__introduction'>
                <p>We are aggregating, standardzing and sharing air quality data by building a real-time database that provides programmatic and historical access to air quality data.</p>
                <p><Link to='/about' className='button button--large button--base-bounded'>Learn More</Link></p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          {this.renderStatsCount()}

          <NearbyLocations
            _geolocateUser={this.props._geolocateUser}
            _fetchNearbyLocations={this.props._fetchNearbyLocations}
            geolocationRequesting={this.props.geolocationRequesting}
            geolocationRequested={this.props.geolocationRequested}
            geolocationCoords={this.props.geolocationCoords}
            geolocationError={this.props.geolocationError}
            locFetching={this.props.locFetching}
            locFetched={this.props.locFetched}
            locError={this.props.locError}
            locations={this.props.locations}
            countries={this.props.countries}
            sources={this.props.sources}
            parameters={this.props.parameters} />

          <section className='fold fold--filled'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Compare locations</h1>
              </header>
              <div className='fold__body'>
              </div>
            </div>
          </section>

          {this.renderCommunity()}

        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    statsCounts: state.baseStats.data,
    statsCountsFetching: state.baseStats.fetching,
    statsCountsFetched: state.baseStats.fetched,

    geolocationRequesting: state.geolocation.requesting,
    geolocationRequested: state.geolocation.requested,
    geolocationError: state.geolocation.error,
    geolocationCoords: state.geolocation.coords,

    locFetching: state.nearbyLocations.fetching,
    locFetched: state.nearbyLocations.fetched,
    locError: state.nearbyLocations.error,
    locations: state.nearbyLocations.data.results,

    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters
  };
}

function dispatcher (dispatch) {
  return {
    _fetchBaseStats: (...args) => dispatch(fetchBaseStats(...args)),
    _geolocateUser: (...args) => dispatch(geolocateUser(...args)),
    _fetchNearbyLocations: (...args) => dispatch(fetchNearbyLocations(...args))
  };
}

module.exports = connect(selector, dispatcher)(Home);
