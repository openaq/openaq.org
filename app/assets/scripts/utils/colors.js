var d3 = require('d3');
import { parameterMax, parameterUnit } from './map-settings';
import { round } from '../utils/format';

const mapColors = [
  { label: '0', color: '#f7faf0' },
  { label: '10', color: '#e0efda' },
  { label: '20', color: '#cde6c4' },
  { label: '30', color: '#abd9b5' },
  { label: '40', color: '#7bccc4' },
  { label: '50', color: '#4db3d2' },
  { label: '60', color: '#2c8cbe' },
  { label: '70', color: '#0769ad' },
  { label: '80', color: '#1e4280' }
];

export const unusedColor = '#B3B3B3';

export function getMapColors () {
  return mapColors;
}

export function getMapColorsHex () {
  return mapColors.map(o => o.color);
}

export function getMapColorsLabels () {
  return mapColors.map(o => o.label);
}

export function generateColorStops (parameter) {
  const colorScale = generateColorScale(parameterMax[parameter]);

  let stops = getMapColorsHex().map((c) => {
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
  const colorScale = d3.scaleQuantize().domain([0, parameterMax]).range(getMapColorsHex());
  return colorScale;
}

export function generateLegendStops (parameter) {
  let stops = generateColorStops(parameter);
  // Remove the "unused" color.
  stops.shift();
  let lastVal = stops[stops.length - 1][0];
  // How many decimals depends on the highest value.
  let decimals = 0;
  if (lastVal < 10) {
    decimals = 2;
  } else if (lastVal < 100) {
    decimals = 1;
  }
  stops = stops.map(o => ({
    label: round(o[0], decimals),
    color: o[1]
  }));

  // Customize first and last labels.
  stops[0].label = '0' + parameterUnit[parameter];
  stops[stops.length - 1].label += '+';

  return stops;
}
