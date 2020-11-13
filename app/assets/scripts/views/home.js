'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import * as d3 from 'd3';

import { shortenLargeNumber } from '../utils/format';
import {
  geolocateUser,
  fetchNearbyLocations,
  fetchCompareLocationIfNeeded,
  fetchCompareLocationMeasurements,
  invalidateCompare,
  openDownloadModal,
} from '../actions/action-creators';
import LoadingMessage from '../components/loading-message';
import JoinFold from '../components/join-fold';
import Testimonials from '../components/testimonials';
import { convertParamIfNeeded, parameterUnit } from '../utils/map-settings';

import SponsorList from '../components/sponsor-list';
import { getCountryName } from '../utils/countries';
import ChartMeasurement from '../components/chart-measurement';

import sponsors from '../../content/sponsors.json';
import testimonials from '../../content/testimonials.json';

// We're currently showing 2 random locations in the homepage. However
// there's no api endpoint to do this. The only way is to query for a random
// page. For now we're hardcoding the total number of pages available but in
// the future this should be dynamic.
// Total pages come from this query.
// https://api.openaq.org/v1/locations?parameter=pm25&limit=1
const totalPages = 5024;

const MAX_TRIES = 5;

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Keep count of how many tries as a safety kill switch
      compareTries: [],
    };
  }

  fetchValidLocation(idx) {
    // Keep count of how many tries as a safety kill switch
    this.setState({
      compareTries: Object.assign([], this.state.compareTries, {
        [idx]: (this.state.compareTries[idx] || 0) + 1,
      }),
    });
    if (this.state.compareTries[idx] > MAX_TRIES) return;

    const now = Date.now();
    const weekAgo = now - 8 * 86400 * 1000;

    this.props
      ._fetchCompareLocationIfNeeded(idx, null, {
        page: Math.floor(Math.random() * totalPages) + 1,
        parameter: 'pm25',
        limit: 1,
      })
      .then(() => {
        const loc = this.props.compareLoc[idx].data;
        const lastUpdate = new Date(loc.lastUpdated).getTime();
        if (lastUpdate > now || lastUpdate < weekAgo) {
          // Try again.
          return this.fetchValidLocation(idx);
        }
        // Fetch measurements after we have the location name.
        const toDate = moment.utc(loc.lastUpdated);
        const fromDate = toDate.clone().subtract(8, 'days');
        return this.props._fetchCompareLocationMeasurements(
          idx,
          loc.location,
          fromDate.toISOString(),
          toDate.toISOString()
        );
      });
  }

  //
  // Start life-cycle methods
  //
  componentDidMount() {
    this.props._invalidateCompare();

    this.fetchValidLocation(0);
    this.fetchValidLocation(1);
  }

  componentWillUnmount() {
    // Void any tries to stop requests
    this.setState({
      compareTries: this.state.compareTries.map(() => Infinity),
    });
  }

  getTestimonial() {
    if (!this.randomTestimonial) {
      // Pick a random testimonial for this mount.
      // This will be removed in the future in favor of a carousel
      this.randomTestimonial =
        testimonials[Math.floor(Math.random() * (testimonials.length - 1))];
    }
    return [this.randomTestimonial];
  }

  getSponsors() {
    if (!this.randomSponsors) {
      const shuffled = [...sponsors].sort(() => Math.random() - 0.5);
      this.randomSponsors = shuffled.slice(0, 6);
    }
    return this.randomSponsors;
  }

  //
  // Start render methods
  //

  renderStatsCount() {
    const {
      statsCountsFetching: fetching,
      statsCountsFetched: fetched,
      statsCounts: data,
    } = this.props;

    if (!fetched && !fetching) {
      return null;
    }

    return (
      <section
        className="fold fold--dark fold--type-b"
        id="home-fold-open-data"
      >
        <div className="inner">
          <header className="fold__header">
            <h1 className="fold__title">Open Data</h1>
            <div className="fold__teaser prose prose--responsive">
              <p>
                The data is captured from multiple sources and made accessible
                to all through our open-source platform.
              </p>
              <ol className="od-quick-menu">
                <li>
                  <Link
                    to="/locations"
                    title="View page"
                    className="od-quick-menu__locations-link"
                  >
                    Location view
                  </Link>
                </li>
                <li>
                  <a
                    href="https://docs.openaq.org/"
                    target="_blank"
                    rel="noreferrer"
                    title="View API"
                    className="od-quick-menu__api-link"
                  >
                    API
                  </a>
                </li>
                <li>
                  <Link
                    to="/countries"
                    title="View page"
                    className="od-quick-menu__countries-link"
                  >
                    Country view
                  </Link>
                </li>
                <li>
                  <Link
                    to="/compare"
                    title="View page"
                    className="od-quick-menu__compare-link"
                  >
                    Compare data
                  </Link>
                </li>
              </ol>
              <p className="fold__main-action">
                <Link
                  to="/locations"
                  className="button button--large button--primary-ghost button--capsule"
                  title="View page"
                >
                  <span>See open data</span>
                </Link>
                <a
                  href="https://docs.openaq.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="button button--large button--white-bounded button--capsule"
                  title="View API"
                >
                  <span>Use API</span>
                </a>
              </p>
            </div>
          </header>
          <figure className="fold__media">
            {!fetching ? (
              <ol className="big-stats-list">
                <li className="big-stat">
                  <strong className="big-stat__value">
                    {shortenLargeNumber(data.totalMeasurements, 0)}
                  </strong>
                  <span className="big-stat__label">
                    Air quality measurements
                  </span>
                </li>
                <li className="big-stat">
                  <strong className="big-stat__value">
                    {shortenLargeNumber(data.sources, 0)}
                  </strong>
                  <span className="big-stat__label">Data sources</span>
                </li>
                <li className="big-stat">
                  <strong className="big-stat__value">
                    {shortenLargeNumber(data.locations, 0)}
                  </strong>
                  <span className="big-stat__label">Locations</span>
                </li>
                <li className="big-stat">
                  <strong className="big-stat__value">
                    {shortenLargeNumber(data.countries, 0)}
                  </strong>
                  <span className="big-stat__label">Countries</span>
                </li>
              </ol>
            ) : (
              <LoadingMessage />
            )}
          </figure>
        </div>
      </section>
    );
  }

  render() {
    const [l1, l2] = this.props.compareLoc;
    const [m1, m2] = this.props.compareMeasurements;

    return (
      <section className="inpage">
        <header className="inpage__header">
          <div className="inner">
            <div className="inpage__headline">
              <h1 className="inpage__title">
                Fighting air inequality through open data and community.
              </h1>
              <div className="inpage__introduction">
                <p>
                  OpenAQ is a non-profit organization empowering communities
                  around the globe to clean their air by harmonizing, sharing,
                  and using open air quality data.
                </p>
              </div>
            </div>
            <div className="home-rand-meas">
              <h2>Here&apos;s how two random locations compare</h2>
              <CompareLocationCard
                location={l1}
                measurement={m1}
                triesExhausted={this.state.compareTries[0] > MAX_TRIES}
              />
              <CompareLocationCard
                location={l2}
                measurement={m2}
                triesExhausted={this.state.compareTries[1] > MAX_TRIES}
              />
            </div>
          </div>
          <figure className="inpage__media inpage__media--cover media">
            <div className="media__item">
              <img
                src="/assets/graphics/content/view--home/cover--home.jpg"
                alt="Cover image"
                width="1440"
                height="712"
              />
            </div>
          </figure>
        </header>
        <div className="inpage__body">
          <section className="fold fold--intro">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">
                  1 out of 8 deaths in the world is due to poor air quality
                </h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    This is one of the largest public health threats of our
                    time.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/layout/oaq-illu-home-stats.svg"
                  width="408"
                  height="80"
                  alt="Illustration"
                />
              </figure>
              <p className="fold__action">
                <Link to="/why" title="Learn more" className="go-link">
                  <span>Learn more about this problem</span>
                </Link>
              </p>
            </div>
          </section>

          <section className="fold fold--semi-light fold--type-a">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__subtitle">What we do</h1>
                <h2 className="fold__title">Harmonizing air quality data</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    The OpenAQ Community harmonizes disparate air quality data
                    from across the world so that citizens and organizations can
                    fight air inequality more efficiently.
                  </p>
                  <p>
                    <Link to="/about" title="Learn more" className="go-link">
                      <span>Learn more</span>
                    </Link>
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/view--home/fold-what-we-do-media.png"
                  alt="Fold media"
                  width="1246"
                  height="1076"
                />
              </figure>
            </div>
          </section>

          {this.renderStatsCount()}

          <section className="fold fold--type-a" id="home-fold-community">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__subtitle">Community</h1>
                <h2 className="fold__title">
                  Collective impact through community
                </h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Improving global air quality requires action across sectors
                    and geographies. Our worldwide community leverages open data
                    to build:
                  </p>
                  <ol className="community-details">
                    <li>Data platforms</li>
                    <li>Developer tools</li>
                    <li>Education tools</li>
                    <li>Low-cost sensors</li>
                    <li>Media</li>
                    <li>Models</li>
                    <li>Research</li>
                    <li>Software</li>
                  </ol>
                  <p>
                    <Link
                      to="/community"
                      title="Learn more"
                      className="go-link"
                    >
                      <span>Learn more</span>
                    </Link>
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/view--home/fold-community-media.png"
                  alt="Fold media"
                  width="932"
                  height="1128"
                />
              </figure>
            </div>
          </section>

          <section
            className="fold fold--semi-light fold--type-b"
            id="home-fold-sponsors"
          >
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__subtitle">Partners and sponsors</h1>
                <h2 className="fold__title">Enabling change at scale</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Our nonprofit work is made possible with the support of our
                    partners.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <SponsorList items={this.getSponsors()} />
              </figure>
            </div>
          </section>

          <Testimonials items={this.getTestimonial()} />

          <JoinFold />
        </div>
      </section>
    );
  }
}

Home.propTypes = {
  _geolocateUser: T.func,
  _fetchNearbyLocations: T.func,
  _fetchCompareLocationIfNeeded: T.func,
  _fetchCompareLocationMeasurements: T.func,
  _invalidateCompare: T.func,
  _openDownloadModal: T.func,

  statsCounts: T.object,
  statsCountsFetching: T.bool,
  statsCountsFetched: T.bool,

  geolocationRequesting: T.bool,
  geolocationRequested: T.bool,
  geolocationError: T.string,
  geolocationCoords: T.object,

  locFetching: T.bool,
  locFetched: T.bool,
  locError: T.string,
  locations: T.array,
  locPagination: T.object,

  countries: T.array,
  sources: T.array,
  parameters: T.array,
  totalMeasurements: T.number,

  compareLoc: T.array,
  compareMeasurements: T.array,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
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
    totalMeasurements: state.baseData.data.totalMeasurements,

    compareLoc: state.compare.locations,
    compareMeasurements: state.compare.measurements,
  };
}

function dispatcher(dispatch) {
  return {
    _geolocateUser: (...args) => dispatch(geolocateUser(...args)),
    _fetchNearbyLocations: (...args) => dispatch(fetchNearbyLocations(...args)),

    _invalidateCompare: (...args) => dispatch(invalidateCompare(...args)),

    _fetchCompareLocationIfNeeded: (...args) =>
      dispatch(fetchCompareLocationIfNeeded(...args)),
    _fetchCompareLocationMeasurements: (...args) =>
      dispatch(fetchCompareLocationMeasurements(...args)),

    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Home);

class CompareLocationCard extends React.Component {
  renderCompareChart() {
    const { measurement } = this.props;

    // All the times are local and shouldn't be converted to UTC.
    // The values should be compared at the same time local to ensure an
    // accurate comparison.
    const userNow = moment().format('YYYY/MM/DD HH:mm:ss');
    const weekAgo = moment().subtract(7, 'days').format('YYYY/MM/DD HH:mm:ss');

    const filterFn = o => {
      if (o.parameter !== 'pm25') {
        return false;
      }
      if (o.value < 0) return false;
      const localDate = moment
        .parseZone(o.date.local)
        .format('YYYY/MM/DD HH:mm:ss');
      return localDate >= weekAgo && localDate <= userNow;
    };

    // Prepare data.
    const chartData = _.cloneDeep(measurement.data.results)
      .filter(filterFn)
      .map(o => {
        o.value = convertParamIfNeeded(o);
        // Disregard timezone on local date.
        const dt = o.date.local.match(
          /^[0-9]{4}(?:-[0-9]{2}){2}T[0-9]{2}(?::[0-9]{2}){2}/
        )[0];
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

    const yMax = d3.max(chartData, o => o.value) || 0;

    // 1 Week.
    const xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

    if (!chartData.length) return null;

    return (
      <ChartMeasurement
        className="home-compare-chart"
        data={[chartData]}
        xRange={xRange}
        yRange={[0, yMax]}
        yLabel={parameterUnit['pm25']}
        compressed
      />
    );
  }

  render() {
    const { location, measurement, triesExhausted } = this.props;

    if (triesExhausted) {
      return (
        <article className="card card--measurement">
          <div className="card__contents">
            <div className="card__body">
              <p>No locations with measurements were found</p>
            </div>
          </div>
        </article>
      );
    }

    if (!location.fetched || !measurement.fetched) {
      return (
        <article className="card card--measurement">
          <div className="card__contents">
            <div className="card__body">
              <p>Loading data</p>
            </div>
          </div>
        </article>
      );
    }

    const { city, country, location: loc } = location.data;

    // Get all pm25 measurements.
    const pm25measure = measurement.data.results.filter(
      m => m.parameter === 'pm25'
    );
    const recentMeasure = pm25measure[0];

    return (
      <article className="card card--measurement">
        <Link
          to={`/location/${loc}`}
          className="card__contents"
          title="View more"
        >
          <header className="card__header">
            <div className="card__headline">
              <h1 className="card__title">{loc}</h1>
            </div>
          </header>
          <div className="card__body">
            <dl className="card--measurement__details">
              <dt>Measurements</dt>
              {recentMeasure && <dd>PM2.5</dd>}
              {recentMeasure && (
                <dd>
                  <strong>{Math.round(recentMeasure.value)}</strong>{' '}
                  <sub>{recentMeasure.unit}</sub>
                </dd>
              )}
              <dt>Location</dt>
              <dd>
                {city}
                <span>, </span>
                <small>{getCountryName(country) || 'N/A'}</small>
              </dd>
            </dl>
            <figure className="card--measurement__chart">
              {this.renderCompareChart()}
            </figure>
          </div>
        </Link>
      </article>
    );
  }
}

CompareLocationCard.propTypes = {
  location: T.object,
  measurement: T.object,
  triesExhausted: T.bool,
};
