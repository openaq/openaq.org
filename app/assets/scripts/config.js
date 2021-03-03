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
    baseStyle: process.env.MAPBOX_BASE_STYLE,
  },
  api: process.env.API,
  metadata: process.env.METADATA,
  apiDocs: process.env.APIDOCS,
  feedbackUrl: process.env.FEEDBACK_URL,
  dataTypesUrl: process.env.DATA_TYPES_URL,
  newSourceUrl: process.env.NEW_SOURCE_URL,
};
