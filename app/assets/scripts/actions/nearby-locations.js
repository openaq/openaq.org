import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                        NEARBY LOCATIONS                       //
// ////////////////////////////////////////////////////////////////

function requestNearbyLocations () {
  return {
    type: actions.REQUEST_NEARBY_LOCATIONS
  };
}

function receiveNearbyLocations (json, error = null) {
  return {
    type: actions.RECEIVE_NEARBY_LOCATIONS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchNearbyLocations (coords, radius = 5) {
  return function (dispatch) {
    dispatch(requestNearbyLocations());

    fetch(`${config.api}/locations?limit=3&radius=${radius * 1000}&coordinates=${coords.join(',')}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => {
        //   dispatch(receiveNearbyLocations(json));
        // }, 2000);
        dispatch(receiveNearbyLocations(json));
      }, e => {
        console.log('e', e);
        return dispatch(receiveNearbyLocations(null, 'Data not available'));
      });
  };
}
