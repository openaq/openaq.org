import fetch from 'isomorphic-fetch';
import parse from 'csv-parse/lib/sync';
import * as actions from './action-types';
import config from '../config';

// ////////////////////////////////////////////////////////////////
//                        NEARBY LOCATIONS                       //
// ////////////////////////////////////////////////////////////////

function requestLandscape () {
  return {
    type: actions.REQUEST_LANDSCAPE
  };
}

function receiveLandscape (json, error = null) {
  return {
    type: actions.RECEIVE_LANDSCAPE,
    json: json,
    error,
    receivedAt: Date.now()
  };
}

// Data is managed through a Google Spreadsheet, which may have data
// consistency issues. This function aims to deal with most of them.
function parseResponse (string) {
  const ls = string.toLowerCase();

  if (ls === 'yes' || ls === 'y') return 'yes';
  if (ls === 'no' || ls === 'n' || ls === '-') return 'no';
  return 'unclear';
}

// Generates a score from the four attributes
function generateScore (c) {
  return [ c.physicalData, c.highresSpatial, c.highresTemporal, c.programmaticAccess ].reduce((sum, res) => {
    if (res === 'yes') return sum + 1;
    if (res === 'no') return sum;
    return sum + 0.25;
  }, 0);
}

export function fetchLandscape (coords) {
  return function (dispatch) {
    dispatch(requestLandscape());

    fetch(config.landscape)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.text();
      })
      .then(res => {
        const json = parse(res, {columns: true});
        return json;
      })
      .then(json => {
        const parsedJson = json.map(c => {
          c.physicalData = parseResponse(c.physicalData);
          c.highresSpatial = parseResponse(c.highresSpatial);
          c.highresTemporal = parseResponse(c.highresTemporal);
          c.programmaticAccess = parseResponse(c.programmaticAccess);
          c.score = generateScore(c);
          return c;
        });
        dispatch(receiveLandscape(parsedJson));
      }, e => {
        console.log('e', e);
        return dispatch(receiveLandscape(null, 'Data not available'));
      });
  };
}
