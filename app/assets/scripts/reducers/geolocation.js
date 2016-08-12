import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  requesting: false,
  requested: false,
  coords: {
    latitude: null,
    longitude: null
  },
  error: null
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.GEOLOCATION_REQUEST:
      console.log('GEOLOCATION_REQUEST');
      state = _.cloneDeep(state);
      state.error = null;
      state.requesting = true;
      break;
    case actions.GEOLOCATION_ACQUIRE:
      console.log('GEOLOCATION_ACQUIRE');
      state = _.cloneDeep(state);
      state.coords = action.coords;
      state.error = null;
      state.requesting = false;
      state.requested = true;
      break;
    case actions.GEOLOCATION_ERROR:
      console.log('GEOLOCATION_ERROR');
      state = _.cloneDeep(state);
      state.error = action.error;
      state.requesting = false;
      state.requested = true;
      break;
  }
  return state;
}
