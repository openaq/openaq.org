'use strict';

import Reflux from 'reflux';
import nets from 'nets';
import { parallel } from 'async';
import moment from 'moment';
import { omit } from 'lodash';

import actions from '../actions/actions';
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
          // Add milliseconds since updated so we can filter on it
          l.lastUpdatedMilliseconds = self._getMillisecondOffset(m.lastUpdated);
          if (m.parameter === 'pm25') {
            l = Object.assign({}, l, m);
            l = omit(l, ['measurements']);
            pm25.push(l);
          } else if (m.parameter === 'pm10') {
            l = Object.assign({}, l, m);
            l = omit(l, ['measurements']);
            pm10.push(l);
          } else if (m.parameter === 'co') {
            l = Object.assign({}, l, m);
            l = omit(l, ['measurements']);
            co.push(l);
          } else if (m.parameter === 'no2') {
            l = Object.assign({}, l, m);
            l = omit(l, ['measurements']);
            no2.push(l);
          } else if (m.parameter === 'so2') {
            l = Object.assign({}, l, m);
            l = omit(l, ['measurements']);
            so2.push(l);
          } else if (m.parameter === 'o3') {
            l = Object.assign({}, l, m);
            l = omit(l, ['measurements']);
            o3.push(l);
          } else if (m.parameter === 'bc') {
            l = Object.assign({}, l, m);
            l = omit(l, ['measurements']);
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
    };

    let createGetFunction = function (limit, page) {
      return function (done) {
        return nets({ url: config.apiURL + 'latest?has_geo&limit=' + limit + '&page=' + page }, function (err, res, body) {
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

    nets({ url: config.apiURL + 'latest?has_geo&limit=0' }, function (err, res, body) {
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

        console.log(data);

        // Handle the joined results
        handleResults(data);
      });
    });
  }

});

export { LatestStore as default };
