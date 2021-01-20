import fetch from 'isomorphic-fetch';
import { stringify as buildAPIQS } from 'qs';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                           LOCATIONS                           //
// ////////////////////////////////////////////////////////////////

function requestLocationsByCountry() {
  return {
    type: actions.REQUEST_LOCATIONS_BY_COUNTRY,
  };
}

function receiveLocationsByCountry(json, error = null) {
  return {
    type: actions.RECEIVE_LOCATIONS_BY_COUNTRY,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchLocationsByCountry(country, filters = {}) {
  return function (dispatch) {
    dispatch(requestLocationsByCountry());

    let limit = 10000;
    filters.country = country;
    let f = buildAPIQS(filters, { skipNulls: true });

    fetch(`${config.api}/locations?limit=${limit}&${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          // setTimeout(() => {
          //   dispatch(receiveLocations(json));
          // }, 2000);
          dispatch(receiveLocationsByCountry(json));
        },
        e => {
          console.log('e', e);
          return dispatch(
            receiveLocationsByCountry(null, 'Data not available')
          );
        }
      );
  };
}

export function invalidateLocationsByCountry() {
  return {
    type: actions.INVALIDATE_LOCATIONS_BY_COUNTRY,
  };
}
