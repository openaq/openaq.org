import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import { stringify as buildAPIQS } from 'qs';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                           LOCATIONS                           //
// ////////////////////////////////////////////////////////////////

function requestLocations () {
  return {
    type: actions.REQUEST_LOCATIONS
  };
}

function receiveLocations (json, error = null) {
  return {
    type: actions.RECEIVE_LOCATIONS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchLocations (page = 1, filters, limit = 15) {
  return function (dispatch) {
    dispatch(requestLocations());

    let f = buildAPIQS(filters);

    // console.log('url', `${config.api}/locations?page=${page}&limit=${limit}&${f}`);

    fetch(`${config.api}/locations?page=${page}&limit=${limit}&${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => {
        //   dispatch(receiveLocations(json));
        // }, 2000);
        dispatch(receiveLocations(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveLocations(null, 'Data not available'));
      });
  };
}

export function invalidateLocations () {
  return {
    type: actions.INVALIDATE_LOCATIONS
  };
}

export function invalidateAllLocationData () {
  return {
    type: actions.INVALIDATE_ALL_LOCATION_DATA
  };
}
