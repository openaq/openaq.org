'use strict';
var logo = require('./logo');
/*
 * App config for production.
 */
module.exports = {
  environment: 'production',
  consoleMessage: logo,
  mapbox: {
    token: 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJnUi1mbkVvIn0.018aLhX0Mb0tdtaT2QNe2Q',
    baseStyle: 'mapbox://styles/devseed/ciqs29d060000clnr9222bg5x',
  },
  api: 'https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2',
  metadata: 'https://metadata.openaq.org',
  apiDocs: 'https://docs.openaq.org',
};
