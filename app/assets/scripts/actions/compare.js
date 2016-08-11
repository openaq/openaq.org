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

function receiveCompareLocation (json, index, error = null) {
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
      return dispatch(receiveCompareLocation(l, index));
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
        //   dispatch(receiveCompareLocation(json.results[0], index));
        // }, 5000);
        dispatch(receiveCompareLocation(json.results[0], index));
      }, e => {
        console.log('e', e);
        return dispatch(receiveCompareLocation(null, index, 'Data not available'));
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
