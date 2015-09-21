'use strict';

var _ = require('lodash');

var countries = require('./country-list');

exports.getPrettyCountry = function (abbr) {
  return _.result(_.find(countries, { 'Code': abbr }), 'Name');
};
