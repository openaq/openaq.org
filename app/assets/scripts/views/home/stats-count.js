import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { shortenLargeNumber } from '../../utils/format';
import LoadingMessage from '../../components/loading-message';

export default function StatsCount(props) {
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
  fetched: PropTypes.bool,
  fetching: PropTypes.bool,
  data: PropTypes.object,
};
