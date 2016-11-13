'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import c from 'classnames';
import _ from 'lodash';
import * as d3 from 'd3';

import { formatThousands } from '../utils/format';
import { geolocateUser,
  fetchNearbyLocations,
  fetchCompareLocationIfNeeded,
  fetchCompareLocationMeasurements,
  invalidateCompare,
  openDownloadModal } from '../actions/action-creators';
import { convertParamIfNeeded, parameterUnit } from '../utils/map-settings';
import NearbyLocations from '../components/nearby-locations';
import CommunityCard from '../components/community-card';
import InfoMessage from '../components/info-message';
import LoadingMessage from '../components/loading-message';
import ChartMeasurement from '../components/chart-measurement';
import content from '../../content/content.json';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    _geolocateUser: React.PropTypes.func,
    _fetchNearbyLocations: React.PropTypes.func,
    _fetchCompareLocationIfNeeded: React.PropTypes.func,
    _fetchCompareLocationMeasurements: React.PropTypes.func,
    _invalidateCompare: React.PropTypes.func,
    _openDownloadModal: React.PropTypes.func,

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
    parameters: React.PropTypes.array,

    compareLoc: React.PropTypes.array,
    compareMeasurements: React.PropTypes.array
  },

  //
  // Start life-cycle methods
  //
  componentDidMount: function () {
    this.props._invalidateCompare();
    // We're currently showing 2 random locations in the homepage. However
    // there's no api endpoint to do this. The only way is to query for a random
    // page. For now we're hardcoding the total number of pages available but in
    // the future this should be dynamic.
    // Total pages come from this query.
    // https://api.openaq.org/v1/locations?parameter=pm25&limit=1
    let totalPages = 1213;

    this.props._fetchCompareLocationIfNeeded(0, null, {
      page: Math.floor(Math.random() * totalPages) + 1,
      parameter: 'pm25',
      limit: 1
    });

    this.props._fetchCompareLocationIfNeeded(1, null, {
      page: Math.floor(Math.random() * totalPages) + 1,
      parameter: 'pm25',
      limit: 1
    });
  },

  componentDidUpdate: function () {
    let [l1, l2] = this.props.compareLoc;
    let [m1, m2] = this.props.compareMeasurements;

    let toDate = moment.utc();
    let fromDate = toDate.clone().subtract(8, 'days');

    if (l1.fetched && !m1.fetched && !m1.fetching) {
      // Fetch measurements after we have the location name.
      this.props._fetchCompareLocationMeasurements(0, l1.data.location, fromDate.toISOString(), toDate.toISOString());
    }

    if (l2.fetched && !m2.fetched && !m2.fetching) {
      // Fetch measurements after we have the location name.
      this.props._fetchCompareLocationMeasurements(1, l2.data.location, fromDate.toISOString(), toDate.toISOString());
    }
  },

  //
  // Start render methods
  //

  renderStatsCount: function () {
    let {statsCountsFetching: fetching, statsCountsFetched: fetched, statsCounts: data} = this.props;
    if (!fetched && !fetching) {
      return null;
    }

    return (
      <section className='fold fold--filled' id='home-stats'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>The data</h1>
            <div className='fold__introduction prose prose--responsive'>
              {!fetching
                ? (<p>Our community has collected <strong>{formatThousands(data.measurements)}</strong> air quality measurements from <strong>{formatThousands(data.locations)}</strong> locations in <strong>{formatThousands(data.countries)}</strong> countries. Data are aggregated from <strong>{formatThousands(data.sources)}</strong> government level and research-grade sources. <small className='disclaimer'><a href='https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85'>Data Disclaimer and More Information</a></small></p>)
                : <LoadingMessage />}
            </div>
          </header>
        </div>
      </section>
    );
  },

  renderCompareChart: function () {
    // All the times are local and shouldn't be converted to UTC.
    // The values should be compared at the same time local to ensure an
    // accurate comparison.
    let userNow = moment().format('YYYY/MM/DD HH:mm:ss');
    let weekAgo = moment().subtract(7, 'days').format('YYYY/MM/DD HH:mm:ss');

    const filterFn = (o) => {
      if (o.parameter !== 'pm25') {
        return false;
      }
      if (o.value < 0) return false;
      let localDate = moment.parseZone(o.date.local).format('YYYY/MM/DD HH:mm:ss');
      return localDate >= weekAgo && localDate <= userNow;
    };

    // Prepare data.
    let chartData = _(this.props.compareMeasurements)
      .filter(o => o.fetched && !o.fetching && o.data)
      .map(o => {
        return _.cloneDeep(o.data.results)
          .filter(filterFn)
          .map(o => {
            o.value = convertParamIfNeeded(o);
            // Disregard timezone on local date.
            let dt = o.date.local.match(/^[0-9]{4}(?:-[0-9]{2}){2}T[0-9]{2}(?::[0-9]{2}){2}/)[0];
            // `measurement` local date converted directly to user local.
            // We have to use moment instead of new Date() because the behavior
            // is not consistent across browsers.
            // Firefox interprets the string as being in the current timezone
            // while chrome interprets it as being utc. So:
            // Date: 2016-08-25T14:00:00
            // Firefox result: Thu Aug 25 2016 14:00:00 GMT-0400 (EDT)
            // Chrome result: Thu Aug 25 2016 10:00:00 GMT-0400 (EDT)
            o.date.localNoTZ = moment(dt).toDate();
            return o;
          });
      })
      .value();

    let yMax = d3.max(chartData || [], r => d3.max(r, o => o.value)) || 0;

    // 1 Week.
    let xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

    // Only show the "no results" message if stuff has loaded
    let fetchedMeasurements = this.props.compareMeasurements.filter(o => o.fetched && !o.fetching);
    if (fetchedMeasurements.length) {
      let dataCount = chartData.reduce((prev, curr) => prev + curr.length, 0);

      if (!dataCount) {
        return (
          <InfoMessage>
            <p>There are no data for the selected parameter</p>
            <p>Maybe you'd like to suggest a <a href='https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform' title='Suggest a new source'>new source</a>.</p>
          </InfoMessage>
        );
      }
    }

    return (
      <ChartMeasurement
        className='home-compare-chart'
        data={chartData}
        xRange={xRange}
        yRange={[0, yMax]}
        yLabel={parameterUnit['pm25']} />
    );
  },

  renderCompareLocations: function () {
    let [l1, l2] = this.props.compareLoc;
    let [m1, m2] = this.props.compareMeasurements;
    let body = null;

    // Wait until something is actually fetching.
    if (!l1.fetched && !l2.fetched &&
      !m1.fetched && !m2.fetched) {
      return null;
    }

    // Anything loading?
    if (l1.fetching || l2.fething ||
      m1.fetching || m2.fething) {
      body = (
        <div className='fold__body'>
          <LoadingMessage />
        </div>
      );
    } else {
      body = (
        <div className='fold__body'>
          <div className='col-main'>
            <ul className='compare__location-list'>
              {[l1, l2].map((o, i) => {
                if (!o.fetched) return null;

                let d = o.data;
                let updated = moment(d.lastUpdated).fromNow();
                let countryData = _.find(this.props.countries, {code: d.country});
                let kl = ['compare-marker--st', 'compare-marker--nd'];

                return (
                  <li className='compare__location' key={d.location} >
                    <p className='compare__subtitle'>Updated {updated}</p>
                    <h2 className='compare__title'><Link to={`/location/${encodeURIComponent(d.location)}`}><span className={c('compare-marker', kl[i])}>{d.location}</span></Link> <small>in {d.city}, {countryData.name}</small></h2>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='col-sec'>
            <p className='chart-description'>PM2.5 values over last week</p>
            <div>{this.renderCompareChart()}</div>
          </div>
        </div>
      );
    }

    return (
      <section className='fold fold--filled' id='home-compare'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Compare locations</h1>
            <div className='fold__introduction prose prose--responsive'>
              <p>See how air quality compares between 2 random locations</p>
            </div>
          </header>
          {body}
          <div className='fold__footer'>
          {l1.data && l2.data
          ? <Link to={`/compare/${encodeURIComponent(l1.data.location)}/${encodeURIComponent(l2.data.location)}`} title='View Locations' className='button button--large button--primary-bounded button--semi-fluid'>Compare Other Locations</Link>
          : null}
          </div>
        </div>
      </section>
    );
  },

  renderCommunity: function () {
    let cards = _.filter(content.projects, o => o.featured)
      .map(o => {
        return (
          <CommunityCard
            key={_.kebabCase(o.title)}
            horizontal={true}
            title={o.title}
            linkTitle='View this community contribution'
            url={o.url}
            imageNode={<img width='256' height='256' src={o.image} alt='Project image' />} >
            <div dangerouslySetInnerHTML={{__html: o.body}} />
          </CommunityCard>
        );
      });

    return (
      <section className='fold' id='home-community'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Join our community</h1>
            <div className='fold__introduction prose prose--responsive'>
              <p>Learn how researchers, software developers, educators, and journalists are using open air quality data in exciting ways to fight air inequality.</p>
            </div>
          </header>
          <div className='fold__body'>
            {cards}
          </div>
          <div className='fold__footer'>
            <Link to='/community' title='See community page' className='button button--large button--primary-bounded button--semi-fluid'>Get Involved</Link>
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
                <p>Our community aggregates and shares open air quality data from around the world. We believe open access to air quality data empowers the public to fight air inequality.</p>
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
            _openDownloadModal={this.props._openDownloadModal}
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

          {this.renderCompareLocations()}

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
    parameters: state.baseData.data.parameters,

    compareLoc: state.compare.locations,
    compareMeasurements: state.compare.measurements
  };
}

function dispatcher (dispatch) {
  return {
    _geolocateUser: (...args) => dispatch(geolocateUser(...args)),
    _fetchNearbyLocations: (...args) => dispatch(fetchNearbyLocations(...args)),

    _invalidateCompare: (...args) => dispatch(invalidateCompare(...args)),

    _fetchCompareLocationIfNeeded: (...args) => dispatch(fetchCompareLocationIfNeeded(...args)),
    _fetchCompareLocationMeasurements: (...args) => dispatch(fetchCompareLocationMeasurements(...args)),

    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args))
  };
}

module.exports = connect(selector, dispatcher)(Home);
