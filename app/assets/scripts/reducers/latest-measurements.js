import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  fetching: false,
  fetched: false,
  data: null
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.REQUEST_LATEST_MEASUREMENTS:
      console.log('REQUEST_LATEST_MEASUREMENTS');
      state = _.cloneDeep(state);
      state.error = null;
      state.fetching = true;
      break;
    case actions.RECEIVE_LATEST_MEASUREMENTS:
      console.log('RECEIVE_LATEST_MEASUREMENTS');
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
