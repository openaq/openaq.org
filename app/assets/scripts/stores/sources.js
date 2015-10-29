'use strict';

var Reflux = require('reflux');
var nets = require('nets');

var config = require('../config');
var actions = require('../actions/actions');

var SourcesStore = Reflux.createStore({

  storage: {
    sources: []
  },

  init: function () {
    this.getSources();
  },

  getSources: function () {
    var self = this;

    nets({ url: config.apiURL + 'sources' }, function (err, res, body) {
      if (err) {
        return console.error(err);
      }

      var data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return console.error(e);
      }

      self.storage.sources = data.results;

      // Done, send out action
      actions.latestSourcesLoaded();
    });
  }

});

module.exports = SourcesStore;
