'use strict';

import Reflux from 'reflux';
import nets from 'nets';
import { parallel } from 'async';
import moment from 'moment';
import { omit } from 'lodash';

import { latestValuesLoaded } from '../actions/actions';
import config from '../config';

const LatestStore = Reflux.createStore({

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

    let handleResults = function (data) {
      // Move data into paramter specific arrays
      var pm25 = [];
      var pm10 = [];
      var o3 = [];
      var co = [];
      var so2 = [];
      var no2 = [];
      var bc = [];
      data.results.forEach((l) => {
        l.measurements.forEach((m) => {
          let loc = Object.assign({}, l, m);
          // Add milliseconds since updated so we can filter on it
          loc.lastUpdatedMilliseconds = self._getMillisecondOffset(m.lastUpdated);
          // Omit unneeded props to save on buffer size
          loc = omit(loc, ['measurements', 'city', 'country']);
          if (m.parameter === 'pm25') {
            pm25.push(loc);
          } else if (m.parameter === 'pm10') {
            pm10.push(loc);
          } else if (m.parameter === 'co') {
            co.push(loc);
          } else if (m.parameter === 'no2') {
            no2.push(loc);
          } else if (m.parameter === 'so2') {
            so2.push(loc);
          } else if (m.parameter === 'o3') {
            o3.push(loc);
          } else if (m.parameter === 'bc') {
            bc.push(loc);
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
      latestValuesLoaded();
    };

    let createGetFunction = function (limit, page) {
      return function (done) {
        return nets({ url: config.apiURL + 'latest?has_geo&value_from=0&limit=' + limit + '&page=' + page }, function (err, res, body) {
          if (err) {
            return done(err);
          }

          var data;
          try {
            data = JSON.parse(body);
          } catch (e) {
            return done(e);
          }

          return done(null, data.results);
        });
      };
    };

    nets({ url: config.apiURL + 'latest?has_geo&value_from=0&limit=0' }, function (err, res, body) {
      if (err) {
        return console.error(err);
      }

      var data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        return console.error(e);
      }

      // Run extra fetch tasks to get all pages of data
      var tasks = [];
      var limit = 1000;
      for (var i = 1; i <= Math.ceil(data.meta.found / limit); i++) {
        var f = createGetFunction(limit, i);
        tasks.push(f);
      }

      parallel(tasks, function (err, results) {
        if (err) {
          return console.error(err);
        }

        // Join all results
        results.forEach(function (r) {
          data.results = data.results.concat(r);
        });

        // Handle the joined results
        handleResults(data);
      });
    });
  }

});

export default LatestStore;
