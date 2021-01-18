import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                          BASE STATS                           //
// ////////////////////////////////////////////////////////////////
// Base data needed for the operations.
// Countries, Sources, Parameters.

function requestBaseStats() {
  return {
    type: actions.REQUEST_BASE_STATS,
  };
}

function receiveBaseStats(json, error = null) {
  return {
    type: actions.RECEIVE_BASE_STATS,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchBaseStats() {
  return function (dispatch) {
    dispatch(requestBaseStats());
    // Keep track of what's finished.
    let complete = 0;
    let data = {
      locations: null,
      // We're also tracking countries and sources, but those are already
      // queried with the base data, there's no need for an additional one.
    };

    // Data fetcher.
    const fetcher = what => {
      fetch(`${config.api}/${what}?limit=1`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            data[what] = json.meta.found;
            dispatch(receiveBaseStats(data));
          },
          e => {
            // Throw error only once.
            if (complete === -1) {
              return;
            }
            complete = -1;
            console.log('e', e);
            return dispatch(receiveBaseStats(null, 'Data not available'));
          }
        );
    };

    fetcher('locations');
  };
}
