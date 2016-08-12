import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  fetching: false,
  fetched: false,
  data: {
    countries: null,
    sources: null,
    locations: null,
    measurements: null
  }
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.RECEIVE_BASE_DATA:
      console.log('base-stats: RECEIVE_BASE_DATA');
      if (action.error) {
        break;
      }
      state = _.cloneDeep(state);
      // The countries and sources count come from the RECEIVE_BASE_DATA action
      // it is safe to assume that this works because without this data the
      // site is not even displayed.
      state.data.countries = action.json.countries.length;
      state.data.sources = action.json.sources.length;
      break;
    case actions.REQUEST_BASE_STATS:
      console.log('REQUEST_BASE_STATS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_BASE_STATS:
      console.log('RECEIVE_BASE_STATS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data.measurements = action.json.measurements;
        state.data.locations = action.json.locations;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
}
