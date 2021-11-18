'use strict';
var logo = require('./logo');
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  consoleMessage: logo,
  mapbox: {
    token: 'pk.eyJ1Ijoib3BlbmFxIiwiYSI6ImNrdzJmc2drMDBhcmgydW1wYTQ5aTVhNHgifQ.aY3RxfSZuCApSitdjdviQQ',
    baseStyle: 'mapbox://styles/openaq/ckw2fwkcc1o5314qs5l555iip',
  },
  api: 'https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2', // will eventually be 'https://api.openaq.org/v2'
  metadata: 'https://metadata.openaq.org',
  apiDocs: 'https://docs.openaq.org',
  feedbackUrl: 'https://forms.gle/rqsAPDSebNTG8PsJ8',
  dataTypesUrl:
    // eslint-disable-next-line inclusive-language/use-inclusive-words
    'https://github.com/openaq/openaq-data-format/blob/master/data-type-definitions.md',
  newSourceUrl:
    'https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform',
};
