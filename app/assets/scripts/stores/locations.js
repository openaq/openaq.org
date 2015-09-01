'use strict';

var Reflux = require('reflux');
var nets = require('nets');
var _ = require('lodash');

var actions = require('../actions/actions');

var LocationsStore = Reflux.createStore({

  storage: {
    totalNumber: 0
  },

  init: function () {
    this.getSites();
  },

  prettifyCountries: function () {
    this.storage.countries = _.map(this.storage.countries, function (c) {
      switch (c.country) {
        case 'CN':
          c.prettyCountry = 'China';
          break;
        case 'UK':
          c.prettyCountry = 'United Kingdom';
          break;
        case 'IN':
          c.prettyCountry = 'India';
          break;
        case 'MN':
          c.prettyCountry = 'Mongolia';
          break;
      }

      return c;
    });
  },

  // Put into a standard order and give them pretty names
  prettifyParams: function (params) {
    // Sort
    var order = ['pm25', 'pm10', 'co', 'so2', 'no2', 'o3', 'bc'];
    params = _.sortBy(params, function (p) {
      return _.indexOf(order, p);
    });

    // Nice names
    params = _.map(params, function (p) {
      switch (p) {
        case 'pm25':
          return 'PM2.5';
        default:
          return p.toUpperCase();
      }
    });

    return params;
  },

  getSites: function () {
    var self = this;

    nets({ url: 'https://api.openaq.org/v1/locations' }, function (err, res, body) {
      if (err) {
        return console.error(err);
      }

      var data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return console.error(e);
      }

      self.storage.countries = data.results;

      // Get total number of measurements
      self.storage.countries.forEach(function (l) {
        self.storage.totalNumber += l.count;
      });

      // Make the parameter names nicer
      _.map(self.storage.countries, function (c) {
        return _.map(c.cities, function (ci) {
          return _.map(ci.locations, function (l) {
            l.parameters = self.prettifyParams(l.parameters);
            return l;
          });
        });
      });

      // Make the country names nicer
      self.prettifyCountries();

      // Done, send out action
      actions.latestLocationsLoaded();
    });
  }

});

module.exports = LocationsStore;
