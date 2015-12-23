'use strict';

var Reflux = require('reflux');

var Actions = Reflux.createActions({

  'latestSourcesLoaded': {},
  'latestLocationsLoaded': {},
  'metadataLoaded': {},
  'latestValuesLoaded': {},
  'closeMapSidebar': {},
  'mapParameterChanged': {}

});

module.exports = Actions;
