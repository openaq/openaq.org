import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import { round } from '../../utils/format';

export default function Popover({
  parameter,
  properties: { lastUpdated, value, unit, location, id, source },
}) {
  // TODO: fetch data from /location endpoint instead of feature props

  let reading = <p>{parameter} N/A</p>;
  if (lastUpdated) {
    let lastUp = moment.utc(lastUpdated).format('YYYY/MM/DD HH:mm');
    reading = (
      <p>
        Last reading{' '}
        <strong>
          {round(value)} {unit}
        </strong>{' '}
        at <strong>{lastUp}</strong>
      </p>
    );
  }

  return (
    <article className="popover">
      <div className="popover__contents">
        <header className="popover__header">
          <h1 className="popover__title">
            <a
              href={`#/location/${encodeURIComponent(id)}`}
              title={`View ${location} page`}
            >
              {location}
            </a>
          </h1>
        </header>
        <div className="popover__body">
          {reading}
          {source && (
            <p>
              Source:{' '}
              <a href={source.url} title="View source information">
                {source.name}
              </a>
            </p>
          )}
          <ul className="popover__actions">
            {/*
                Using `a` instead of `Link` because these are rendered outside
                the router context and `Link` needs that context to work.
              */}
            <li>
              <a
                href={`#/compare/${encodeURIComponent(id)}`}
                className="button button--primary-bounded"
                title={`Compare ${name} with other locations`}
              >
                Compare
              </a>
            </li>
            <li>
              <a
                href={`#/location/${encodeURIComponent(id)}`}
                title={`View ${name} page`}
                className="button button--primary-bounded"
              >
                View More
              </a>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}

Popover.propTypes = {
  parameter: T.string.isRequired,
  properties: T.shape({
    lastUpdated: T.string.isRequired,
    value: T.number.isRequired,
    unit: T.string.isRequired,
    location: T.string.isRequired,
    id: T.string.isRequired,
    source: T.string.isRequired,
  }).isRequired,
};
