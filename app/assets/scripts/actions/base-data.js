import fetch from 'isomorphic-fetch';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                           BASE DATA                           //
// ////////////////////////////////////////////////////////////////
// Base data needed for the operations.
// Countries, Sources, Parameters.

function requestBaseData() {
  return {
    type: actions.REQUEST_BASE_DATA,
  };
}

function receiveBaseData(json, error = null) {
  return {
    type: actions.RECEIVE_BASE_DATA,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchBaseData() {
  return function (dispatch, getState) {
    const current = getState().baseData;

    if (current.fetching) {
      // Do nothing as a request is in progress.
      return;
    }

    dispatch(requestBaseData());

    if (current.fetched && !current.error) {
      // There's data. No need to request again.
      return dispatch(receiveBaseData(current.data));
    }

    let data = {
      countries: [],
      sources: [],
      parameters: [],
      manufacturers: [],
      models: [],
      totalMeasurements: 0,
    };

    // Data fetcher.
    const fetcher = what =>
      fetch(`${config.api}/${what}?limit=1000`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(json => {
          data[what] = json.results;
          return json;
        });

    Promise.all([
      fetcher('countries').then(json => {
        data.totalMeasurements = json.results.reduce(
          (acc, c) => acc + c.count,
          0
        );
        data.countries = data.countries.filter(country => country.name);
      }),
      fetcher('sources'),
      fetcher('parameters'),
      fetcher('manufacturers'),
      fetcher('models'),
    ]).then(
      () => {
        dispatch(receiveBaseData(data));
      },
      e => {
        console.log('Base data error', e);
        return dispatch(receiveBaseData(null, 'Data not available'));
      }
    );
  };
}
