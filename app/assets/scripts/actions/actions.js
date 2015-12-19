'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions({

  'latestSourcesLoaded': {},
  'latestLocationsLoaded': {},
  'metadataLoaded': {},
  'latestValuesLoaded': {},
  'closeMapPopup': {}

});

module.exports = Actions;
