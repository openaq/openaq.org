import _ from 'lodash';
import * as actions from '../actions/action-types';

// 3 Compare locations is the maximum.
const defaultState = {
  compareSelectOpts: {
    status: 'none',
    country: '--',
    area: '--',
    location: '--'
  },
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
  ],
  measurements: [
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
      state.measurements[action.index] = _.cloneDeep(defaultState.measurements[0]);
      break;

    case actions.SELECT_COMPARE_OPTIONS:
      console.log('SELECT_COMPARE_OPTIONS');
      state = _.cloneDeep(state);
      state.compareSelectOpts.status = 'selecting';
      break;
    case actions.CANCEL_COMPARE_OPTIONS:
      console.log('CANCEL_COMPARE_OPTIONS');
      state = _.cloneDeep(state);
      state.compareSelectOpts.status = 'none';
      state.compareSelectOpts.country = '--';
      state.compareSelectOpts.area = '--';
      state.compareSelectOpts.location = '--';
      break;

    case actions.SELECT_COMPARE_OPT_COUNTRY:
      console.log('SELECT_COMPARE_OPT_COUNTRY');
      state = _.cloneDeep(state);
      state.compareSelectOpts.country = action.country;
      state.compareSelectOpts.area = '--';
      state.compareSelectOpts.location = '--';
      break;
    case actions.SELECT_COMPARE_OPT_AREA:
      console.log('SELECT_COMPARE_OPT_AREA');
      state = _.cloneDeep(state);
      state.compareSelectOpts.area = action.area;
      state.compareSelectOpts.location = '--';
      break;
    case actions.SELECT_COMPARE_OPT_LOCATION:
      console.log('SELECT_COMPARE_OPT_LOCATION');
      state = _.cloneDeep(state);
      state.compareSelectOpts.location = action.location;
      break;

    case actions.REQUEST_COMPARE_LOCATION_MEASUREMENTS:
      console.log('REQUEST_COMPARE_LOCATION_MEASUREMENTS');
      state = _.cloneDeep(state);
      state.measurements[action.index].error = null;
      state.measurements[action.index].fetching = true;
      break;
    case actions.RECEIVE_COMPARE_LOCATION_MEASUREMENTS:
      console.log('RECEIVE_COMPARE_LOCATION_MEASUREMENTS');
      state = _.cloneDeep(state);
      if (action.error) {
        state.measurements[action.index].error = action.error;
      } else {
        state.measurements[action.index].data = action.json;
      }
      state.measurements[action.index].fetching = false;
      state.measurements[action.index].fetched = true;
      break;

    case actions.INVALIDATE_COMPARE:
      console.log('INVALIDATE_COMPARE');
      state = _.cloneDeep(defaultState);
      break;
  }
  return state;
}
