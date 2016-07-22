import _ from 'lodash';

export function buildQS (qParams, valSep = ',', separator = '&') {
  let stringified = [];

  _.forEach(qParams, (v, k) => {
    console.log('_.isEmpty(v)', _.isEmpty(v));
    if (_.isInteger(v) || !_.isEmpty(v)) {
      let val = _.isArray(v) ? v.join(valSep) : v;
      stringified.push(`${k}=${val}`);
    }
  });
console.log('qParams', qParams);
console.log('url', stringified.join(separator));
  return stringified.join(separator);
}
