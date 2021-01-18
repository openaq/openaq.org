import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { NO_CITY } from '../../utils/constants';
import { getCountryName } from '../../utils/countries';
import CompareLocationCardChart from './compare-location-card-chart';

export default function CompareLocationCard(props) {
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
  location: PropTypes.object,
  measurement: PropTypes.object,
};
