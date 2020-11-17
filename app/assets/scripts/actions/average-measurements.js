import fetch from 'isomorphic-fetch';
import { stringify as buildAPIQS } from 'qs';
import * as actions from './action-types';
import config from '../config';
import moment from 'moment';

// ////////////////////////////////////////////////////////////////
//                     AVERAGE MEASUREMENTS                      //
// ////////////////////////////////////////////////////////////////

function requestAverageMeasurements() {
  return {
    type: actions.REQUEST_AVERAGE_MEASUREMENTS,
  };
}

function receiveAverageMeasurements(json, error = null) {
  return {
    type: actions.RECEIVE_AVERAGE_MEASUREMENTS,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchAverageMeasurements(filters) {
  return function (dispatch) {
    dispatch(requestAverageMeasurements());

    let data = null;
    let limit = 1000;
    let f = buildAPIQS(filters);
    const yDay = moment().subtract(1, 'day').format('YYYY-MM-DD')

    const fetcher = function (page) {
      fetch(
        `${
          config.api.split('/v1')[0]
        }/beta/averages?page=${page}&limit=${limit}&${f}`
      )
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            if (data === null) {
              data = json;
            } else {
              data.results = data.results.concat(json.results);
            }
            if (page * limit < json.meta.found) {
              return fetcher(++page);
            } else {
              return dispatch(receiveAverageMeasurements(data));
            }
          },
          e => {
            console.log('e', e);
            return dispatch(
              receiveAverageMeasurements(null, 'Data not available')
            );
          }
        );
    };

    fetcher(1);
  };
}
