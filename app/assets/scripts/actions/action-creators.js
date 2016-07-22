import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import * as actions from './action-types';
import config from '../config';
import { buildQS } from '../utils/url';

// ////////////////////////////////////////////////////////////////
//                           BASE DATA                           //
// ////////////////////////////////////////////////////////////////
// Base data needed for the operations.
// Countries, Sources, Parameters.

function requestBaseData () {
  return {
    type: actions.REQUEST_BASE_DATA
  };
}

function receiveBaseData (json, error = null) {
  return {
    type: actions.RECEIVE_BASE_DATA,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchBaseData () {
  return function (dispatch) {
    dispatch(requestBaseData());
    // We have to make 3 separate request.
    // Keep track of what's finished.
    let complete = 0;
    let data = {
      countries: [],
      sources: [],
      parameters: []
    };

    // Data fetcher.
    const fetcher = (what) => {
      fetch(`${config.api}/${what}?limit=1000`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(json => {
          data[what] = json.results;
          // Check if we're done with the requests.
          if (complete === -1 || ++complete < 3) {
            return;
          }
          dispatch(receiveBaseData(data));
        }, e => {
          // Throw error only once.
          if (complete === -1) {
            return;
          }
          complete = -1;
          console.log('e', e);
          return dispatch(receiveBaseData(null, 'Data not available'));
        });
    };

    fetcher('countries');
    fetcher('sources');
    fetcher('parameters');
  };
}

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

    let f = buildQS(filters);

    console.log('url', `${config.api}/locations?page=${page}&limit=${limit}&${f}`);

    fetch(`${config.api}/locations?page=${page}&limit=${limit}&${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
        console.log('js', json);
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
