'use strict';

var Reflux = require('reflux');
var _ = require('lodash');

var locationsStore = require('./locations');
var sourcesStore = require('./sources');
var actions = require('../actions/actions');

var MetadataStore = Reflux.createStore({

  init: function () {
    this.joinTrailing(
      actions.latestLocationsLoaded,
      actions.latestSourcesLoaded,
      this.createMetadata
    );
  },

  storage: {
    countries: []
  },

  createMetadata: function () {
    // Go through and merge sites and sources data
    var countries = locationsStore.storage.countries;
    var sources = sourcesStore.storage.sources;
    _.map(countries, function (c) {
      return _.map(c.cities, function (ci) {
        return _.map(ci.locations, function (l) {
          var s = _.findWhere(sources, { name: l.sourceName });
          l.sourceURL = s.sourceURL;
          l.resolution = s.resolution;
          return l;
        });
      });
    });

    this.storage.countries = countries;
    // Done, send out action
    actions.metadataLoaded();
  }

});

module.exports = MetadataStore;
