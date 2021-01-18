import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  open: false,
  downloadType: null,
  country: null,
  area: null,
  location: null,
  project: null,
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
      if (action.options.downloadType) {
        state.downloadType = action.options.downloadType;
      }
      if (action.options.project) {
        state.project = action.options.project;
      }
      break;
    case actions.CLOSE_DOWNLOAD_MODAL:
      state = _.cloneDeep(defaultState);
      break;
  }
  return state;
}
