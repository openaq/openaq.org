import fetch from 'isomorphic-fetch';
import { stringify as buildAPIQS } from 'qs';
import _ from 'lodash';

import * as actions from './action-types';
import config from '../config';
import { PM25_PARAMETER_ID } from '../utils/constants';

// ////////////////////////////////////////////////////////////////
//                       COMPARE LOCATION                        //
// ////////////////////////////////////////////////////////////////

export function invalidateCompare() {
  return {
    type: actions.INVALIDATE_COMPARE,
  };
}

function requestCompareLocation(index) {
  return {
    type: actions.REQUEST_COMPARE_LOCATION,
    index,
  };
}

function receiveCompareLocation(index, json, error = null) {
  return {
    type: actions.RECEIVE_COMPARE_LOCATION,
    index,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

function receiveMultipleCompareLocation(count, data, error = null) {
  return {
    type: actions.RECEIVE_MULTIPLE_COMPARE_LOCATION,
    count,
    data,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchCompareLocationIfNeeded(index, location, filters = {}) {
  return function (dispatch, getState) {
    dispatch(requestCompareLocation(index));
    if (location) {
      // Search for the location in the state.
      const state = getState();
      const l = _.find(state.locations.data.results, { location: location });
      if (l) {
        return dispatch(receiveCompareLocation(index, l));
      }

      filters.location = location;
    }

    const f = buildAPIQS(filters);

    return fetch(`${config.api}/locations?${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          if (!json.results.length) {
            return dispatch(
              receiveCompareLocation(index, null, 'Data not available')
            );
          }
          return dispatch(receiveCompareLocation(index, json.results[0]));
        },
        e => {
          console.log('e', e);
          return dispatch(
            receiveCompareLocation(index, null, 'Data not available')
          );
        }
      );
  };
}

// Fetches random location and dispatches them to the compare slice of state.
export function fetchRandomCompareLocs(limit = 2) {
  return dispatch => {
    // Dispatch all requests.
    for (let index = 0; index < limit; index++) {
      dispatch(requestCompareLocation(index));
    }

    const f = buildAPIQS({
      order_by: 'random',
      // pm25 has id 2.
      parameter: PM25_PARAMETER_ID,
      limit,
    });

    return fetch(`${config.api}/locations?${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          return dispatch(receiveMultipleCompareLocation(limit, json.results));
        },
        e => {
          console.log('e', e);
          return dispatch(
            receiveMultipleCompareLocation(limit, null, 'Data not available')
          );
        }
      );
  };
}

export function removeCompareLocation(index) {
  return {
    type: actions.REMOVE_COMPARE_LOCATION,
    index,
  };
}

export function selectCompareOptions() {
  return {
    type: actions.SELECT_COMPARE_OPTIONS,
  };
}

export function cancelCompareOptions() {
  return {
    type: actions.CANCEL_COMPARE_OPTIONS,
  };
}

export function selectCompareCountry(country) {
  return {
    type: actions.SELECT_COMPARE_OPT_COUNTRY,
    country,
  };
}

export function selectCompareArea(area) {
  return {
    type: actions.SELECT_COMPARE_OPT_AREA,
    area,
  };
}

export function selectCompareLocation(location) {
  return {
    type: actions.SELECT_COMPARE_OPT_LOCATION,
    location,
  };
}

function requestCompareLocationMeasurements(index) {
  return {
    type: actions.REQUEST_COMPARE_LOCATION_MEASUREMENTS,
    index,
  };
}

function receiveCompareLocationMeasurements(index, json, error = null) {
  return {
    type: actions.RECEIVE_COMPARE_LOCATION_MEASUREMENTS,
    index,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchCompareLocationMeasurements(
  index,
  location,
  startDate,
  endDate,
  parameter
) {
  return function (dispatch) {
    dispatch(requestCompareLocationMeasurements(index));

    let data = null;
    let limit = 1000;
    const fetcher = function (page) {
      let qs = buildAPIQS({
        spatial: 'location',
        temporal: 'hour',
        location,
        page,
        limit,
        parameter,
        date_from: startDate,
        date_to: endDate,
      });

      fetch(`${config.api}/averages?${qs}`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            if (data === null) {
              data = json;
            } else {
              data.results = data.results.concat(json.results);
            }
            if (page * limit < json.meta.found) {
              return fetcher(++page);
            } else {
              return dispatch(receiveCompareLocationMeasurements(index, data));
            }
          },
          e => {
            console.log('e', e);
            return dispatch(
              receiveCompareLocationMeasurements(
                index,
                null,
                'Data not available'
              )
            );
          }
        );
    };

    fetcher(1);
  };
}
