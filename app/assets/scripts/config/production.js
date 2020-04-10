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
    baseStyle: 'mapbox://styles/devseed/ciqs29d060000clnr9222bg5x'
  },
  api: 'https://api.openaq.org/v1',
  landscape: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTc3wDIC5OkB1y4Y9j9TUZiEANfb33P-6Y_0pR0V8eXGxdhF-GON6Yg9QSB1oizVNg9xkEo_6A6SbOs/pub?gid=780249047&single=true&output=csv',
  metadata: 'https://metadata.openaq.org',
  apiDocs: 'https://docs.openaq.org'
};

