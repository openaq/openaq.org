'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { formatThousands } from '../../utils/format';

export default function ProjectCard({
  onDownloadClick,
  name = 'Dataset name',
  city = 'city',
  countryData,
  sourcesData,
  sourceType,
  totalMeasurements,
  parametersList = [],
  lastUpdate,
  collectionStart,
}) {
  let updated = moment(lastUpdate).fromNow();
  let started = moment(collectionStart).format('YYYY/MM/DD');

  let sources = [];
  if (sourcesData && sourcesData.length) {
    sourcesData.forEach((o, i) => {
      sources.push(
        <a href={o.sourceURL} title={`View source for  ${name}`} key={o.name}>
          {o.name}
        </a>
      );
      if (i < sourcesData.length - 1) {
        sources.push(', ');
      }
    });
  }

  const country = countryData || {};

  return (
    <article className="card card--data">
      <div className="card__contents">
        <header className="card__header">
          <div className="card__headline">
            <p className="card__subtitle">
              Updated <strong>{updated}</strong>
            </p>
            <h1 className="card__title">
              <Link
                to={`/location/${encodeURIComponent(name)}`}
                title={`View ${name} page`}
              >
                {name}
              </Link>{' '}
              <small>
                in {city}, {country.name}
              </small>
            </h1>
          </div>
          <div className="card__tags">
            {sourceType && (
              <div className="filter-pill">{`${sourceType[0].toUpperCase()}${sourceType.slice(
                1
              )}`}</div>
            )}
          </div>
        </header>
        <div className="card__body">
          <dl className="card__meta-details">
            <dt>Collection start</dt>
            <dd>{started}</dd>
            <dt>Measurements</dt>
            <dd>{formatThousands(totalMeasurements)}</dd>
            <dt>Values</dt>
            <dd>{parametersList.map(o => o.name).join(', ')}</dd>
            {sources.length ? <dt>Source</dt> : null}
            {sources.length ? <dd>{sources}</dd> : null}
          </dl>
        </div>
        <footer className="card__footer">
          <ul className="card__footer-actions">
            <li>
              <a
                href="#"
                className="cfa-download"
                title={`Download data for ${name}`}
                onClick={onDownloadClick}
              >
                Download
              </a>
            </li>
            <li>
              <Link
                to={`/location/${encodeURIComponent(name)}`}
                className="cfa-go"
                title={`View ${name} page`}
              >
                View More
              </Link>
            </li>
          </ul>
        </footer>
      </div>
    </article>
  );
}

ProjectCard.propTypes = {
  onDownloadClick: T.func,
  compact: T.bool,
  name: T.string,
  city: T.string,
  countryData: T.object,
  sourcesData: T.array,
  sourceType: T.string,
  totalMeasurements: T.number,
  parametersList: T.array,
  lastUpdate: T.string,
  collectionStart: T.string,
};
