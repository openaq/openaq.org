'use strict';

import { findWhere } from 'lodash';
import Reflux from 'reflux';

import locationsStore from './locations';
import sourcesStore from './sources';
import { latestLocationsLoaded, latestSourcesLoaded, metadataLoaded } from '../actions/actions';

var MetadataStore = Reflux.createStore({

  init: function () {
    this.joinTrailing(
      latestLocationsLoaded,
      latestSourcesLoaded,
      this.createMetadata
    );
  },

  storage: {
    countries: [],
    sourceURLs: {}
  },

  createMetadata: function () {
    // Go through and merge sites and sources data
    let countries = locationsStore.storage.countries;
    let sources = sourcesStore.storage.sources;
    countries.forEach((c) => {
      c.cities.forEach((ci) => {
        ci.locations.forEach((l) => {
          let s = findWhere(sources, { name: l.sourceName });
          l.sourceURL = s && s.sourceURL;
          // Since we're already doing this, save in a nicer format for later use
          this.storage.sourceURLs[l.location] = l.sourceURL;
        });
      });
    });

    this.storage.countries = countries;
    // Done, send out action
    metadataLoaded();
  }

});

module.exports = MetadataStore;
