import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                        NEARBY LOCATIONS                       //
// ////////////////////////////////////////////////////////////////

function requestNearbyLocations() {
  return {
    type: actions.REQUEST_NEARBY_LOCATIONS,
  };
}

function receiveNearbyLocations(json, error = null) {
  return {
    type: actions.RECEIVE_NEARBY_LOCATIONS,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchNearbyLocations(coords) {
  return function (dispatch) {
    dispatch(requestNearbyLocations());

    fetch(
      `${
        config.api
      }/locations?order_by=distance&radius=99999999&limit=3&coordinates=${coords.join(
        ','
      )}`
    )
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          dispatch(receiveNearbyLocations(json));
        },
        e => {
          console.log('e', e);
          return dispatch(receiveNearbyLocations(null, 'Data not available'));
        }
      );
  };
}
