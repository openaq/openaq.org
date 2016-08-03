var d3 = require('d3');
import { colorScale as colors, parameterMax, unusedColor } from '../utils/map-settings';

/**
* Generate the color scale based on domain and range
* @param {array} Array of data values
* @param {number} Max value to clamp upper range to
* @return {function} d3 scale function
*/

// PREVIOUS CODE for the inputs for genereateColorStops
// generateColorStops (latestStore.storage.hasGeo[this.state.selectedParameter], parameterMax[this.state.selectedParameter])
export function generateColorStops (parameter) {
  const colorScale = generateColorScale(parameterMax[parameter]);

  let stops = colors.map((c) => {
    return [colorScale.invertExtent(c)[0], c];
  });

  // And add one stop to the beginning to account for interpolation
  stops.unshift([-1, unusedColor]);

  return stops;
}

export function generateColorScale (parameterMax) {
  // From older version of functioning color scale
  // if (!data || !Array.isArray(data)) {
  //   return;
  // }

  // let max = d3Max(data, (d) => {
  //   return (d.convertedValue !== undefined) ? d.convertedValue : d.properties.convertedValue;
  // });

  // max = Math.min(max, parameterMax);

  // Clamp to max value for the parameter

  const colorScale = d3.scaleQuantize().domain([0, parameterMax]).range(colors);

  return colorScale;
}
