import _ from 'lodash';
import * as actions from '../actions/action-types';

// 3 Compare locations is the maximum.
const defaultState = {
  locations: [
    {
      fetching: false,
      fetched: false,
      data: null
    },
    {
      fetching: false,
      fetched: false,
      data: null
    },
    {
      fetching: false,
      fetched: false,
      data: null
    }
  ]
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.REQUEST_COMPARE_LOCATION:
      console.log('REQUEST_COMPARE_LOCATION');
      console.log('ac', action);
      state = _.cloneDeep(state);
      state.locations[action.index].error = null;
      state.locations[action.index].fetching = true;
      break;
    case actions.RECEIVE_COMPARE_LOCATION:
      console.log('RECEIVE_COMPARE_LOCATION');
      state = _.cloneDeep(state);
      if (action.error) {
        state.locations[action.index].error = action.error;
      } else {
        state.locations[action.index].data = action.json;
      }
      state.locations[action.index].fetching = false;
      state.locations[action.index].fetched = true;
      break;
    case actions.REMOVE_COMPARE_LOCATION:
      console.log('REMOVE_COMPARE_LOCATION');
      state = _.cloneDeep(state);
      state.locations[action.index] = _.cloneDeep(defaultState.locations[0]);
      break;
  }
  return state;
}
