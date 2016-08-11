import fetch from 'isomorphic-fetch';
import { stringify as buildAPIQS } from 'qs';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                     LATEST MEASUREMENTS                       //
// ////////////////////////////////////////////////////////////////

function requestLatestMeasurements () {
  return {
    type: actions.REQUEST_LATEST_MEASUREMENTS
  };
}

function receiveLatestMeasurements (json, error = null) {
  return {
    type: actions.RECEIVE_LATEST_MEASUREMENTS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchLatestMeasurements (filters) {
  return function (dispatch) {
    dispatch(requestLatestMeasurements());

    let data = null;
    let limit = 1000;
    let f = buildAPIQS(filters);

    const fetcher = function (page) {
      fetch(`${config.api}/latest?page=${page}&limit=${limit}&${f}`)
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
            console.log('fetchLatestMeasurements done', data);
            return dispatch(receiveLatestMeasurements(data));
          }
        }, e => {
          console.log('e', e);
          return dispatch(receiveLatestMeasurements(null, 'Data not available'));
        });
    };

    fetcher(1);
  };
}
