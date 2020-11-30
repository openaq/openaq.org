import fetch from 'isomorphic-fetch';
import { stringify as buildAPIQS } from 'qs';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                           PROJECTS                           //
// ////////////////////////////////////////////////////////////////

function requestProjects() {
  return {
    type: actions.REQUEST_PROJECTS,
  };
}

function receiveProjects(json, error = null) {
  return {
    type: actions.RECEIVE_PROJECTS,
    json: json,
    error,
    receivedAt: Date.now(),
  };
}

export function fetchProjects(page = 1, filters, limit = 15) {
  return function (dispatch) {
    dispatch(requestProjects());

    let f = buildAPIQS(filters);

    // console.log('url', `${config.api}/projects?page=${page}&limit=${limit}&${f}`);

    fetch(
      `${config.api}/projects?page=${page}&limit=${limit}&metadata=true&${f}`
    )
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          // setTimeout(() => {
          //   dispatch(receiveProjects(json));
          // }, 2000);
          dispatch(receiveProjects(json));
        },
        e => {
          console.log('e', e);
          return dispatch(receiveProjects(null, 'Data not available'));
        }
      );
  };
}

export function invalidateProjects() {
  return {
    type: actions.INVALIDATE_PROJECTS,
  };
}

export function invalidateAllProjectData() {
  return {
    type: actions.INVALIDATE_ALL_PROJECT_DATA,
  };
}
