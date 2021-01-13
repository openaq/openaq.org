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

export default function Popover({
  activeParameter,
  isAllLocations,
  locationId,
  currentPage,
  selectedLocations,
  handleLocationSelection,
}) {
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);
  // console.log('isAllLocations', isAllLocations);
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
              data: json.results[0],
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
  const allSelectedLocations =
    selectedLocations && Object.values(selectedLocations).flat();
  // const allSelectedParams = Object.keys(selectedLocations).flat();
  const parameter = data.parameters.find(
    // TODO: clean up parameter mess with id vs name
    p =>
      p.id === activeParameter.id ||
      p.parameterId === activeParameter.parameterId
  );
  const isDisabled =
    selectedLocations &&
    !allSelectedLocations.includes(locationId) &&
    allSelectedLocations.length >= 15;
  return (
    <article className="popover">
      <div className="popover__contents">
        <header className="popover__header">
          <h1 className="popover__title">
            <a
              href={`#/location/${encodeURIComponent(locationId)}`}
              title={`View ${data.name} page`}
            >
              {data.name}
            </a>
          </h1>
        </header>
        <div className="popover__body">
          {parameter && (
            <p>
              Last reading{' '}
              <strong>
                {round(parameter.lastValue)} {parameter.unit}
              </strong>{' '}
              at <strong>{lastUpdated}</strong>
            </p>
          )}

          {data.sources && (
            <p>
              Source:{' '}
              <a
                href={data.sources[0].sourceURL}
                title="View source information"
              >
                {data.sources[0].name}
              </a>
            </p>
          )}
          {isAllLocations || !allSelectedLocations ? (
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
              {locationId !== currentPage && (
                <li>
                  <a
                    href={`#/location/${encodeURIComponent(locationId)}`}
                    title={`View ${name} page`}
                    className="button button--primary-bounded"
                  >
                    View More
                  </a>
                </li>
              )}
            </ul>
          ) : (
            <button
              title="Select Location"
              className={`button button--primary-bounded ${
                isDisabled && 'disabled'
              }`}
              disabled={isDisabled}
              onClick={() =>
                handleLocationSelection(activeParameter, locationId)
              }
            >
              <div>
                <span style={{ marginRight: `.5rem` }}>
                  {selectedLocations[activeParameter]?.includes(locationId)
                    ? 'Remove Location'
                    : 'Select Location'}{' '}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

Popover.propTypes = {
  activeParameter: T.number.isRequired,
  locationId: T.number.isRequired,
  currentPage: T.number.isRequired,
  isAllLocations: T.bool,
  selectedLocations: T.object,
  handleLocationSelection: T.func,
};

Popover.defaultProps = {
  isAllLocations: true,
};
