import _ from 'lodash';
import * as actions from '../actions/action-types';

const defaultState = {
  open: true
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.CLOSE_VOTE_MODAL:
      state = _.cloneDeep(defaultState);
      state.open = false;
      break;
  }
  return state;
}
