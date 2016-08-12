import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  fetching: false,
  fetched: false,
  data: {
    meta: {
      page: null,
      limit: null,
      found: null
    },
    results: []
  }
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.REQUEST_NEARBY_LOCATIONS:
      console.log('REQUEST_NEARBY_LOCATIONS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_NEARBY_LOCATIONS:
      console.log('RECEIVE_NEARBY_LOCATIONS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.json;
      }
      state.fetching = false;
      state.fetched = true;
      break;
  }
  return state;
}
