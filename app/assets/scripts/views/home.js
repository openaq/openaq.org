'use strict';
import React, { useEffect, useMemo } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import * as d3 from 'd3';

import { shortenLargeNumber } from '../utils/format';
import {
  fetchRandomCompareLocs,
  fetchCompareLocationMeasurements,
  invalidateCompare,
} from '../actions/action-creators';
import LoadingMessage from '../components/loading-message';
import JoinFold from '../components/join-fold';
import Testimonials from '../components/testimonials';
import { parameterUnit } from '../utils/map-settings';
import { NO_CITY } from '../utils/constants';

import SponsorList from '../components/sponsor-list';
import { getCountryName } from '../utils/countries';
import ChartMeasurement from '../components/chart-measurement';

import sponsors from '../../content/sponsors.json';
import testimonials from '../../content/testimonials.json';

function Home(props) {
  const {
    compareLoc,
    compareMeasurements,
    _invalidateCompare,
    baseStats,
    _fetchRandomCompareLocs,
    _fetchCompareLocationMeasurements,
  } = props;

  const randomTestimonials = useMemo(() => {
    // Pick a random testimonial for this mount.
    // This will be removed in the future in favor of a carousel
    const randomTestimonial =
      testimonials[Math.floor(Math.random() * (testimonials.length - 1))];
    return [randomTestimonial];
  }, []);

  const randomSponsors = useMemo(() => {
    const shuffled = [...sponsors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  useEffect(() => {
    _invalidateCompare();
    _fetchRandomCompareLocs().then(result => {
      if (!result.error) {
        result.data.forEach((loc, index) => {
          const toDate = moment.utc(loc.lastUpdated);
          const fromDate = toDate.clone().subtract(8, 'days');
          _fetchCompareLocationMeasurements(
            index,
            loc.id,
            fromDate.toISOString(),
            toDate.toISOString(),
            'pm25'
          );
        });
      }
    });
  }, []);

  const [l1, l2] = compareLoc;
  const [m1, m2] = compareMeasurements;

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
                around the globe to clean their air by harmonizing, sharing, and
                using open air quality data.
              </p>
            </div>
          </div>
          <div className="home-rand-meas">
            <h2>Here&apos;s how two random locations compare</h2>
            <CompareLocationCard location={l1} measurement={m1} />
            <CompareLocationCard location={l2} measurement={m2} />
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
                  This is one of the largest public health threats of our time.
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

        <StatsCount
          fetching={baseStats.fetching}
          fetched={baseStats.fetched}
          data={baseStats.data}
        />

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
                  <Link to="/community" title="Learn more" className="go-link">
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
              <SponsorList items={randomSponsors} />
            </figure>
          </div>
        </section>

        <Testimonials items={randomTestimonials} />

        <JoinFold />
      </div>
    </section>
  );
}

Home.propTypes = {
  _fetchRandomCompareLocs: T.func,
  _fetchCompareLocationMeasurements: T.func,
  _invalidateCompare: T.func,

  baseStats: T.object,
  compareLoc: T.array,
  compareMeasurements: T.array,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    baseStats: state.baseStats,
    compareLoc: state.compare.locations,
    compareMeasurements: state.compare.measurements,
  };
}

function dispatcher(dispatch) {
  return {
    _invalidateCompare: (...args) => dispatch(invalidateCompare(...args)),

    _fetchRandomCompareLocs: (...args) =>
      dispatch(fetchRandomCompareLocs(...args)),
    _fetchCompareLocationMeasurements: (...args) =>
      dispatch(fetchCompareLocationMeasurements(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Home);

// /////////////////////////////////////////////////////////////////// //
// Helper components

function StatsCount(props) {
  const { fetched, fetching, data } = props;

  if (!fetched && !fetching) {
    return null;
  }

  return (
    <section className="fold fold--dark fold--type-b" id="home-fold-open-data">
      <div className="inner">
        <header className="fold__header">
          <h1 className="fold__title">Open Data</h1>
          <div className="fold__teaser prose prose--responsive">
            <p>
              The data is captured from multiple sources and made accessible to
              all through our open-source platform.
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

StatsCount.propTypes = {
  fetched: T.bool,
  fetching: T.bool,
  data: T.object,
};

function CompareLocationCard(props) {
  const { location, measurement } = props;

  if (location.error || measurement.error) {
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

  const { name, city, country, id } = location.data;

  // Get recent pm25 measurement.
  const recentMeasure = measurement.data.results[0];

  return (
    <article className="card card--measurement">
      <Link to={`/location/${id}`} className="card__contents" title="View more">
        <header className="card__header">
          <div className="card__headline">
            <h1 className="card__title">{name}</h1>
          </div>
        </header>
        <div className="card__body">
          <dl className="card--measurement__details">
            <dt>Measurements</dt>
            {recentMeasure && <dd>PM2.5</dd>}
            {recentMeasure && (
              <dd>
                <strong>{Math.round(recentMeasure.average)}</strong>{' '}
                <sub>{recentMeasure.unit}</sub>
              </dd>
            )}
            <dt>Location</dt>
            <dd>
              {city || NO_CITY}
              <span>, </span>
              <small>{getCountryName(country) || 'N/A'}</small>
            </dd>
          </dl>
          <figure className="card--measurement__chart">
            <CompareLocationCardChart measurement={measurement} />
          </figure>
        </div>
      </Link>
    </article>
  );
}

CompareLocationCard.propTypes = {
  location: T.object,
  measurement: T.object,
};

function CompareLocationCardChart(props) {
  const { measurement } = props;

  // All the times are local and shouldn't be converted to UTC.
  // The values should be compared at the same time local to ensure an
  // accurate comparison.
  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const userNow = moment().format(dateFormat);
  const weekAgo = moment().subtract(7, 'days').format(dateFormat);

  // Prepare data.
  const chartData = useMemo(
    () =>
      measurement.data.results
        .filter(res => {
          if (res.average < 0) return false;
          const measurementDate = moment(res.hour).format(dateFormat);
          return measurementDate >= weekAgo && measurementDate <= userNow;
        })
        .map(o => {
          // Map data according to chart needs.
          return {
            value: o.average,
            date: {
              localNoTZ: new Date(o.hour),
            },
          };
        }),
    [measurement]
  );

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

CompareLocationCardChart.propTypes = {
  measurement: T.object,
};
