import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                           LOCATION                            //
// ////////////////////////////////////////////////////////////////

function requestLocation () {
  return {
    type: actions.REQUEST_LOCATION
  };
}

function receiveLocation (json, error = null) {
  return {
    type: actions.RECEIVE_LOCATION,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchLocationIfNeeded (location) {
  return function (dispatch, getState) {
    dispatch(requestLocation());

    // Search for the location in the state.
    let state = getState();
    let l = _.find(state.locations.data.results, {location: location});
    if (l) {
      return dispatch(receiveLocation(l));
    }
    fetch(`${config.api}/locations?location=${encodeURIComponent(location)}&metadata=true`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        // setTimeout(() => {
        //   dispatch(receiveLocation(json));
        // }, 2000);
        dispatch(receiveLocation(json.results[0]));
      }, e => {
        console.log('e', e);
        return dispatch(receiveLocation(null, 'Data not available'));
      });
  };
}
