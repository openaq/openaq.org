import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import config from '../../config';
import { round } from '../../utils/format';
import LoadingMessage from '../loading-message';
import ErrorMessage from '../error-message';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

export default function Popover({ activeParameter, locationId }) {
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetching: true, error: null }));

      fetch(`${config.api}/locations/${locationId}`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              data: json.results,
            }));
          },
          e => {
            console.log('e', e);
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              error: e,
            }));
          }
        );
    };

    fetchData();

    return () => {
      setState(defaultState);
    };
  }, []);

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingMessage />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  let lastUpdated = moment.utc(data.lastUpdated).format('YYYY/MM/DD HH:mm');
  const parameter = data.parameters.find(p => p.id === activeParameter.id);

  return (
    <article className="popover">
      <div className="popover__contents">
        <header className="popover__header">
          <h1 className="popover__title">
            <a
              href={`#/location/${encodeURIComponent(locationId)}`}
              title={`View ${data.name} page`}
            >
              {location}
            </a>
          </h1>
        </header>
        <div className="popover__body">
          <p>
            Last reading{' '}
            <strong>
              {round(parameter.value)} {parameter.unit}
            </strong>{' '}
            at <strong>{lastUpdated}</strong>
          </p>

          <p>
            Source:{' '}
            <a href={data.sources[0].sourceURL} title="View source information">
              {data.sources[0].name}
            </a>
          </p>

          <ul className="popover__actions">
            {/*
                Using `a` instead of `Link` because these are rendered outside
                the router context and `Link` needs that context to work.
              */}
            <li>
              <a
                href={`#/compare/${encodeURIComponent(locationId)}`}
                className="button button--primary-bounded"
                title={`Compare ${name} with other locations`}
              >
                Compare
              </a>
            </li>
            <li>
              <a
                href={`#/location/${encodeURIComponent(locationId)}`}
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
  activeParameter: T.string.isRequired,
  locationId: T.number.isRequired,
};
