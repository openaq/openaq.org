var d3 = require('d3');
var chroma = require('chroma-js');
import { parameterMax, parameterUnit } from './map-settings';
import { round } from '../utils/format';

// Colors for the legend and point fills
const mapColors = [
  { label: '0', color: '#b5ebb1' },
  { label: '10', color: '#97d8b5' },
  { label: '20', color: '#6dc9c1' },
  { label: '30', color: '#4db3d2' },
  { label: '40', color: '#2c8cbe' },
  { label: '50', color: '#126aae' },
  { label: '60', color: '#4237a8' },
  { label: '70', color: '#3f2086' },
  { label: '80', color: '#400850' }
];

// Colors for the stations without recent values
export const unusedColor = '#eee';
export const unusedBorderColor = '#bbb';

// Generate an array of darker colors for the point borders
export function darkenColors () {
  const darkerColors = JSON.parse(JSON.stringify(mapColors));

  for (var i = 0; i < darkerColors.length; i++) {
    darkerColors[i].color = chroma(darkerColors[i].color).darken().hex();
  }

  return darkerColors;
}

export function getMapColorsHex () {
  return mapColors.map(o => o.color);
}

export function getDarkenedColorsHex () {
  return darkenColors().map(o => o.color);
}

export function getMapColorsLabels () {
  return mapColors.map(o => o.label);
}

export function generateColorStops (parameter, colors) {
  const colorScale = generateColorScale(parameterMax[parameter], getMapColorsHex());
  const darkColorScale = generateColorScale(parameterMax[parameter], getDarkenedColorsHex());
  let stops = getMapColorsHex().map((c) => {
    return [colorScale.invertExtent(c)[0], c];
  });

  // And add one stop to the beginning to account for interpolation
  stops.unshift([-1, unusedColor]);

  if (colors === 'dark') {
    stops = getDarkenedColorsHex().map((e) => {
      return [darkColorScale.invertExtent(e)[0], e];
    });

    stops.unshift([-1, unusedBorderColor]);
  }

  return stops;
}

export function generateColorScale (parameterMax, colorsHex) {
  const colorScale = d3.scaleQuantize().domain([0, parameterMax]).range(colorsHex);
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
