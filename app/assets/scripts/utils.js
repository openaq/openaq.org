'use strict';

import _ from 'lodash';
import { scale, max as d3Max } from 'd3';

import countries from './country-list';
import { colorScale as colors } from './components/mapConfig';

/**
 * Get a nicer country name for a 2 letter abbreviation
 * @param {string} abbr 2 letter ISO country code
 * @return {string} full country name
 */
export function getPrettyCountry (abbr) {
  return _.result(_.find(countries, { 'Code': abbr }), 'Name');
}

/**
 * Get a nicer name for a parameter code
 * @param {string} param system parameter code
 * @return {string} full parameter name for display
 */
export function getPrettyParameterName (param) {
  switch (param) {
    case 'pm25':
      return 'PM 2.5';
    case 'pm10':
      return 'PM 10';
    case 'co':
      return 'Carbon Monoxide';
    case 'so2':
      return 'Sulfur Dioxide';
    case 'no2':
      return 'Nitrogen Dioxide';
    case 'bc':
      return 'Black Carbon';
    case 'o3':
      return 'Ozone';
  }
}

/**
* Generate the color scale based on domain and range
* @param {array} Array of data values
* @param {number} Max value to clamp upper range to
* @return {function} d3 scale function
*/
export function generateColorScale (data, parameterMax) {
  if (!data) {
    return;
  }
  let max = d3Max(data, (d) => {
    return d.convertedValue;
  });

  // Clamp to max value for the parameter
  max = Math.min(max, parameterMax);

  const colorScale = scale
                      .quantize()
                      .domain([0, max])
                      .range(colors);

  return colorScale;
}
