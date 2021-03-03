/*
 * App configuration.
 *
 */
var logo = require('./logo');

module.exports = {
  environment: process.env.NODE_ENV,
  consoleMessage: logo,
  mapbox: {
    token: process.env.MAPBOX_ACCESS_TOKEN,
    baseStyle: 'mapbox://styles/devseed/ciqs29d060000clnr9222bg5x',
  },
  api: process.env.API,
  metadata: 'https://metadata.openaq.org',
  apiDocs: 'https://docs.openaq.org',
  feedbackUrl: 'https://forms.gle/rqsAPDSebNTG8PsJ8',
  dataTypesUrl:
    // eslint-disable-next-line inclusive-language/use-inclusive-words
    'https://github.com/openaq/openaq-data-format/blob/master/data-type-definitions.md',
  newSourceUrl:
    'https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform',
};
