import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import config from '../../config';
import { round } from '../../utils/format';
import LoadingMessage from '../loading-message';
import ErrorMessage from '../error-message';
import SourcesList from '../sources-list';
import CardTag from '../card/card-tag';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

export default function Popover({
  activeParameter,
  isDisplayingSelectionTools,
  locationId,
  currentPage,
  selectedLocations,
  handleLocationSelection,
  popupFunction,
}) {
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

  const allSelectedLocations =
    selectedLocations && Object.values(selectedLocations).flat();
  // const allSelectedParams = Object.keys(selectedLocations).flat();
  const parameter =
    activeParameter && data
      ? data.parameters.find(
          p => p.id === activeParameter || p.parameterId === activeParameter
        )
      : null;
  const isDisabled =
    selectedLocations &&
    !allSelectedLocations.includes(locationId) &&
    allSelectedLocations.length >= 15;
  return (
    <article className="popover">
      <div className="popover__contents">
        {data && (
          <header className="popover__header">
            <h1 className="popover__title">
              <a
                href={`#/location/${encodeURIComponent(locationId)}`}
                title={`View ${data.name} page`}
              >
                {data.name}
              </a>
            </h1>
            {data.isAnalysis && <CardTag label="Analysis" />}
          </header>
        )}
        <div className="popover__body">
          {fetching ? (
            <LoadingMessage />
          ) : fetched && data ? (
            <>
              {parameter && (
                <p>
                  Last reading{' '}
                  <strong>
                    {round(parameter.lastValue, parameter.value > 2 ? 2 : 0)}{' '}
                    {parameter.unit}
                  </strong>{' '}
                  at{' '}
                  <strong>
                    {moment.utc(data.lastUpdated).format('YYYY/MM/DD HH:mm')}
                  </strong>
                </p>
              )}
              {data.sources && (
                <div style={{ display: `flex`, gap: `0.5rem` }}>
                  Source: <SourcesList sources={data.sources} />
                </div>
              )}
              {!isDisplayingSelectionTools && (
                <ul className="popover__actions">
                  {/*
                  Using `a` instead of `Link` because these are rendered outside
                  the router context and `Link` needs that context to work.
                  */}
                  {popupFunction !== undefined ? (
                    <li>
                      <span
                        onClick={() => {
                          popupFunction(locationId);
                        }}
                        className="button button--primary-bounded"
                        title={`Compare ${data.name} with other locations`}
                      >
                        Add to Compare
                      </span>
                    </li>
                  ) : (
                    <li>
                      <a
                        href={`#/compare/${encodeURIComponent(locationId)}`}
                        className="button button--primary-bounded"
                        title={`Compare ${data.name} with other locations`}
                      >
                        Compare
                      </a>
                    </li>
                  )}
                  {locationId !== currentPage && (
                    <li>
                      <a
                        href={`#/location/${encodeURIComponent(locationId)}`}
                        title={`View ${data.name} page`}
                        className="button button--primary-bounded"
                      >
                        View Location
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </>
          ) : (
            <ErrorMessage isShowingDiagnosis={!!error} />
          )}
          {isDisplayingSelectionTools && (
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
  isDisplayingSelectionTools: T.bool,
  selectedLocations: T.object,
  handleLocationSelection: T.func,
  popupFunction: T.func,
};

Popover.defaultProps = {
  isDisplayingSelectionTools: false,
};
