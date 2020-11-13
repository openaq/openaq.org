import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  open: false,
  country: null,
  area: null,
  location: null,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.OPEN_DOWNLOAD_MODAL:
      state = _.cloneDeep(state);
      state.open = true;
      if (action.options.country) {
        state.country = action.options.country;
      }
      if (action.options.area) {
        state.area = action.options.area;
      }
      if (action.options.location) {
        state.location = action.options.location;
      }
      break;
    case actions.CLOSE_DOWNLOAD_MODAL:
      state = _.cloneDeep(defaultState);
      break;
  }
  return state;
}
