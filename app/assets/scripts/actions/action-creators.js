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

export function invalidateLocations () {
  return {
    type: actions.INVALIDATE_LOCATIONS
  };
}

export function invalidateAllLocationData () {
  return {
    type: actions.INVALIDATE_ALL_LOCATION_DATA
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

// ////////////////////////////////////////////////////////////////
//                           LOCATIONS                           //
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

    fetch(`${config.api}/locations?location=${location}`)
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

// ////////////////////////////////////////////////////////////////
//                         MEASUREMENTS                          //
// ////////////////////////////////////////////////////////////////

function requestMeasurements () {
  return {
    type: actions.REQUEST_MEASUREMENTS
  };
}

function receiveMeasurements (json, error = null) {
  return {
    type: actions.RECEIVE_MEASUREMENTS,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

export function fetchMeasurements (location, startDate, endDate) {
  return function (dispatch) {
    dispatch(requestMeasurements());

    let data = null;
    let limit = 1000;

    const fetcher = function (page) {
      console.log('url', `${config.api}/measurements?location=${location}&page=${page}&limit=${limit}&date_from=${startDate}&date_to=${endDate}`);
      fetch(`${config.api}/measurements?location=${location}&page=${page}&limit=1000&date_from=${startDate}&date_to=${endDate}`)
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
            console.log('done', data);
            return dispatch(receiveMeasurements(data));
          }
        }, e => {
          console.log('e', e);
          return dispatch(receiveMeasurements(null, 'Data not available'));
        });
    };

    fetcher(1);
  };
}

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
    let f = buildQS(filters);

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
