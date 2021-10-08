import fetch from 'isomorphic-fetch';
import { stringify as buildAPIQS } from 'qs';
import * as actions from './action-types';
import config from '../config';
// ////////////////////////////////////////////////////////////////
//                         MEASUREMENTS                          //
// ////////////////////////////////////////////////////////////////

function requestMeasurements() {
  return {
    type: actions.REQUEST_MEASUREMENTS,
  };
}

function receiveMeasurements(json, error = null) {
  return {
    type: actions.RECEIVE_MEASUREMENTS,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchMeasurements(location, startDate, endDate) {
  return function (dispatch) {
    dispatch(requestMeasurements());

    let data = null;
    let limit = 1000;

    // The api returns the total number of measurements in the filtered set.
    // Taking the dates into account. However we also need to total number of
    // measurements since ever. This query takes care of that and then we start
    // the actual requests for measurements.
    let totalMeasurements = 0;
    let attribution;
    fetch(
      `${config.api}/measurements?location=${encodeURIComponent(
        location
      )}&include_fields=attribution&limit=1`
    )
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          totalMeasurements = json.meta.found;
          attribution =
            json.results.length > 0 ? json.results[0].attribution : null;
          fetcher(1);
        },
        e => {
          console.log('e', e);
          return dispatch(receiveMeasurements(null, 'Data not available'));
        }
      );

    const fetcher = function (page) {
      let qs = buildAPIQS({
        location,
        page,
        limit,
        date_from: startDate,
        date_to: endDate,
      });

      fetch(`${config.api}/measurements?${qs}`)
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
              data.meta.totalMeasurements = totalMeasurements;
              data.attribution = attribution;
              return dispatch(receiveMeasurements(data));
            }
          },
          e => {
            console.log('e', e);
            return dispatch(receiveMeasurements(null, 'Data not available'));
          }
        );
    };
  };
}
