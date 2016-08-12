var d3 = require('d3');
var chroma = require('chroma-js');
import { parameterMax, parameterUnit } from './map-settings';
import { round } from '../utils/format';

// Colors for the legend and point fills
const mapColors = [
  { label: '0', color: '#e0efda' },
  { label: '10', color: '#cde6c4' },
  { label: '20', color: '#abd9b5' },
  { label: '30', color: '#7bccc4' },
  { label: '40', color: '#4db3d2' },
  { label: '50', color: '#2c8cbe' },
  { label: '60', color: '#126aae' },
  { label: '70', color: '#314899' },
  { label: '80', color: '#3f2584' }
];

// Colors for the stations without recent values
export const unusedColor = '#ddd';
export const unusedBorderColor = '#bababa';

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
