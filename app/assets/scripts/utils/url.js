import _ from 'lodash';

export function buildQS(qParams, valSep = ',', separator = '&') {
  let stringified = [];

  _.forEach(qParams, (v, k) => {
    if (_.isInteger(v) || !_.isEmpty(v)) {
      let val = _.isArray(v) ? v.join(valSep) : v;
      stringified.push(`${k}=${val}`);
    }
  });
  return stringified.join(separator);
}
