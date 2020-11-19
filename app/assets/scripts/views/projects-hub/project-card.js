'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { formatThousands } from '../../utils/format';

export default function ProjectCard({
  onDownloadClick,
  lastUpdate,
  name,
  organization,
  sourceType,
  collectionStart,
  totalRecords,
  totalMeasurements,
  parametersList,
}) {
  let updated = moment(lastUpdate).fromNow();
  let started = moment(collectionStart).format('YYYY/MM/DD');
  let ended = moment(lastUpdate).format('YYYY/MM/DD');

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
                to={`/project/${encodeURIComponent(name)}`}
                title={`View ${name} page`}
              >
                {name}
              </Link>{' '}
              <small>{organization}</small>
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
            <dt>No. of records</dt>
            <dd>{formatThousands(totalRecords)}</dd>
            <dt>Measurements</dt>
            <dd>{formatThousands(totalMeasurements)}</dd>
            <dt>Collection dates</dt>
            <dd>
              {started} - {ended}
            </dd>
            <dt>Measurands</dt>
            <dd>{parametersList.join(', ')}</dd>
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
                to={`/project/${encodeURIComponent(name)}`}
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
  lastUpdate: T.instanceOf(Date),
  name: T.string,
  organization: T.string,
  sourceType: T.string,
  collectionStart: T.instanceOf(Date),
  totalRecords: T.number,
  totalMeasurements: T.number,
  parametersList: T.array,
};
