import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  fetching: false,
  fetched: false,
  data: {
    countries: null,
    sources: null,
    parameters: null
  }
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.REQUEST_BASE_DATA:
      console.log('REQUEST_BASE_DATA');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_BASE_DATA:
      console.log('RECEIVE_BASE_DATA');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data.countries = action.json.countries;
        state.data.sources = action.json.sources;
        state.data.parameters = action.json.parameters;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
}
