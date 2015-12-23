'use strict';

var Reflux = require('reflux');
var nets = require('nets');
var _ = require('lodash');
var moment = require('moment');

var actions = require('../actions/actions');
var config = require('../config');

var LatestStore = Reflux.createStore({

  storage: {
    hasGeo: {}
  },

  init: function () {
    this.getLatest();
  },

  _getMillisecondOffset: function (date) {
    var now = moment.utc();
    var then = moment.utc(date);
    var diff = now.diff(then);
    return diff;
  },

  getLatest: function () {
    var self = this;

    nets({ url: config.apiURL + 'latest?has_geo' }, function (err, res, body) {
      if (err) {
        return console.error(err);
      }

      var data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return console.error(e);
      }

      // Move data into paramter specific arrays
      var pm25 = [];
      var pm10 = [];
      var o3 = [];
      var co = [];
      var so2 = [];
      var no2 = [];
      var bc = [];
      _.forEach(data.results, function (l) {
        _.forEach(l.measurements, function (m) {
          // Add milliseconds since updated so we can filter on it
          l.lastUpdatedMilliseconds = self._getMillisecondOffset(m.lastUpdated);
          if (m.parameter === 'pm25') {
            l = _.assign({}, l, m);
            l = _.omit(l, ['measurements']);
            pm25.push(l);
          } else if (m.parameter === 'pm10') {
            l = _.assign({}, l, m);
            l = _.omit(l, ['measurements']);
            pm10.push(l);
          } else if (m.parameter === 'co') {
            l = _.assign({}, l, m);
            l = _.omit(l, ['measurements']);
            co.push(l);
          } else if (m.parameter === 'no2') {
            l = _.assign({}, l, m);
            l = _.omit(l, ['measurements']);
            no2.push(l);
          } else if (m.parameter === 'so2') {
            l = _.assign({}, l, m);
            l = _.omit(l, ['measurements']);
            so2.push(l);
          } else if (m.parameter === 'o3') {
            l = _.assign({}, l, m);
            l = _.omit(l, ['measurements']);
            o3.push(l);
          } else if (m.parameter === 'bc') {
            l = _.assign({}, l, m);
            l = _.omit(l, ['measurements']);
            bc.push(l);
          }

        });
      });
      self.storage.hasGeo = {
        'pm25': pm25,
        'pm10': pm10,
        'o3': o3,
        'no2': no2,
        'co': co,
        'so2': so2,
        'bc': bc
      };

      // Done, send out action
      actions.latestValuesLoaded();
    });
  }

});

module.exports = LatestStore;
