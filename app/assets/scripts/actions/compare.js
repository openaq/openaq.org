import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                       COMPARE LOCATION                        //
// ////////////////////////////////////////////////////////////////

function requestCompareLocation (index) {
  return {
    type: actions.REQUEST_COMPARE_LOCATION,
    index
  };
}

function receiveCompareLocation (index, json, error = null) {
  return {
    type: actions.RECEIVE_COMPARE_LOCATION,
    index,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchCompareLocationIfNeeded (index, location) {
  return function (dispatch, getState) {
    dispatch(requestCompareLocation(index));

    // Search for the location in the state.
    let state = getState();
    let l = _.find(state.locations.data.results, {location: location});
    if (l) {
      return dispatch(receiveCompareLocation(index, l));
    }

    fetch(`${config.api}/locations?location=${location}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => {
        //   dispatch(receiveCompareLocation(index, json.results[0]));
        // }, 5000);
        dispatch(receiveCompareLocation(index, json.results[0]));
      }, e => {
        console.log('e', e);
        return dispatch(receiveCompareLocation(index, null, 'Data not available'));
      });
  };
}

export function removeCompareLocation (index) {
  return {
    type: actions.REMOVE_COMPARE_LOCATION,
    index
  };
}

export function selectCompareOptions () {
  return {
    type: actions.SELECT_COMPARE_OPTIONS
  };
}

export function cancelCompareOptions () {
  return {
    type: actions.CANCEL_COMPARE_OPTIONS
  };
}

export function selectCompareCountry (country) {
  return {
    type: actions.SELECT_COMPARE_OPT_COUNTRY,
    country
  };
}

export function selectCompareArea (area) {
  return {
    type: actions.SELECT_COMPARE_OPT_AREA,
    area
  };
}

export function selectCompareLocation (location) {
  return {
    type: actions.SELECT_COMPARE_OPT_LOCATION,
    location
  };
}

function requestCompareLocationMeasurements (index) {
  return {
    type: actions.REQUEST_COMPARE_LOCATION_MEASUREMENTS,
    index
  };
}

function receiveCompareLocationMeasurements (index, json, error = null) {
  return {
    type: actions.RECEIVE_COMPARE_LOCATION_MEASUREMENTS,
    index,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchCompareLocationMeasurements (index, location, startDate, endDate) {
  return function (dispatch) {
    dispatch(requestCompareLocationMeasurements(index));

    let data = null;
    let limit = 10000;

    const fetcher = function (page) {
      console.log('url', `${config.api}/measurements?location=${location}&page=${page}&limit=${limit}&date_from=${startDate}&date_to=${endDate}`);
      fetch(`${config.api}/measurements?location=${location}&page=${page}&limit=${limit}&date_from=${startDate}&date_to=${endDate}`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(json => {
          if (data === null) {
            data = json;
          } else {
            data.results = data.results.concat(json.results);
          }
          if (page * limit < json.meta.found) {
            return fetcher(++page);
          } else {
            console.log('done', data);
            return dispatch(receiveCompareLocationMeasurements(index, data));
          }
        }, e => {
          console.log('e', e);
          return dispatch(receiveCompareLocationMeasurements(index, null, 'Data not available'));
        });
    };

    fetcher(1);
  };
}
