import * as actions from './action-types';

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
