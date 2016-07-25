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

    // console.log('url', `${config.api}/locations?page=${page}&limit=${limit}&${f}`);

    fetch(`${config.api}/locations?page=${page}&limit=${limit}&${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(json => {
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

// ////////////////////////////////////////////////////////////////
//                          BASE STATS                           //
// ////////////////////////////////////////////////////////////////
// Base data needed for the operations.
// Countries, Sources, Parameters.

function requestBaseStats () {
  return {
    type: actions.REQUEST_BASE_STATS
  };
}

function receiveBaseStats (json, error = null) {
  return {
    type: actions.RECEIVE_BASE_STATS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchBaseStats () {
  return function (dispatch) {
    dispatch(requestBaseStats());
    // We have to make 2 separate request.
    // Keep track of what's finished.
    let complete = 0;
    let data = {
      locations: null,
      measurements: null
      // We're also tracking countries and sources, but those are already
      // queried with the base data, there's no need for an additional one.
    };

    // Data fetcher.
    const fetcher = (what) => {
      fetch(`${config.api}/${what}?limit=1`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(json => {
          data[what] = json.meta.found;
          // Check if we're done with the requests.
          if (complete === -1 || ++complete < 2) {
            return;
          }
          dispatch(receiveBaseStats(data));
        }, e => {
          // Throw error only once.
          if (complete === -1) {
            return;
          }
          complete = -1;
          console.log('e', e);
          return dispatch(receiveBaseStats(null, 'Data not available'));
        });
    };

    fetcher('locations');
    fetcher('measurements');
  };
}

// ////////////////////////////////////////////////////////////////
//                          GEOLOCATION                          //
// ////////////////////////////////////////////////////////////////

function geolocationRequest () {
  return {
    type: actions.GEOLOCATION_REQUEST
  };
}

function geolocationAcquire (coords) {
  return {
    type: actions.GEOLOCATION_ACQUIRE,
    coords,
    receivedAt: Date.now()
  };
}

function geolocationError (error) {
  return {
    type: actions.GEOLOCATION_ERROR,
    error,
    receivedAt: Date.now()
  };
}

export function geolocateUser () {
  return function (dispatch) {
    dispatch(geolocationRequest());

    if (navigator.geolocation) {
      let errorTimeout = setTimeout(() => dispatch(geolocationError('Request timeout')), 10000);

      navigator.geolocation.getCurrentPosition(position => {
        clearTimeout(errorTimeout);
        return dispatch(geolocationAcquire(position.coords));
      }, e => {
        clearTimeout(errorTimeout);
        return dispatch(geolocationError(e.message));
      });
    } else {
      return dispatch(geolocationError('geolocation not available'));
    }
  };
}

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
