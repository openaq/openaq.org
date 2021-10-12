var d3 = require('d3');
var chroma = require('chroma-js');
import moment from 'moment';

import { round } from '../utils/format';

// Colors for the legend and point fills
const mapColors = [
  { label: '0', color: '#0b75a9' },
  { label: '10', color: '#21b5bb' },
  { label: '20', color: '#8fd4d9' },
  { label: '30', color: '#bfe6ec' },
  { label: '40', color: '#e3f0d9' },
  { label: '50', color: '#f6e19e' },
  { label: '60', color: '#faad5b' },
  { label: '70', color: '#f36d3c' },
  { label: '80', color: '#d93127' },
];

// Colors for the stations without recent values
export const unusedColor = '#ddd';
export const unusedBorderColor = '#555';
export const defaultColor = '#198cff';
export const defaultBorderColor = chroma(defaultColor).darken().hex();
export const highlightColor = '#faa204';
export const highlightBorderColor = chroma(highlightColor).darken().hex();

// Generate an array of darker colors for the point borders
export function darkenColors() {
  const darkerColors = JSON.parse(JSON.stringify(mapColors));

  for (var i = 0; i < darkerColors.length; i++) {
    darkerColors[i].color = chroma(darkerColors[i].color).darken().hex();
  }

  return darkerColors;
}

export function getMapColorsHex() {
  return mapColors.map(o => o.color);
}

export function getDarkenedColorsHex() {
  return darkenColors().map(o => o.color);
}

export function getMapColorsLabels() {
  return mapColors.map(o => o.label);
}

export function generateColorStops(maxColorValue, mode) {
  const colorScale = generateColorScale(maxColorValue, getMapColorsHex());

  const darkColorScale = generateColorScale(
    maxColorValue,
    getDarkenedColorsHex()
  );
  let stops = getMapColorsHex().map(c => {
    return [colorScale.invertExtent(c)[0], c];
  });

  // And add one stop to the beginning to account for interpolation
  stops.unshift([-1, unusedColor]);

  if (mode === 'dark') {
    stops = getDarkenedColorsHex().map(e => {
      return [darkColorScale.invertExtent(e)[0], e];
    });

    stops.unshift([-1, unusedBorderColor]);
  }

  return stops;
}

export function generateColorScale(maxColorValue, colorsHex) {
  const colorScale = d3
    .scaleQuantize()
    .domain([0, maxColorValue])
    .range(colorsHex);
  return colorScale;
}

export function generateLegendStops(parameter) {
  let stops = generateColorStops(parameter.maxColorValue);
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
    color: o[1],
  }));

  // Customize first and last labels.
  stops[0].label = '0' + parameter.unit;
  stops[stops.length - 1].label += '+';

  return stops;
}

const ACTIVE_TIME_WINDOW = moment().subtract(2, 'days').toISOString();

export function getFillExpression(maxColorValue, isDark) {
  return [
    'case',
    ['>', ['get', 'lastUpdated'], ['literal', ACTIVE_TIME_WINDOW]],
    [
      'interpolate',
      ['linear'],
      ['number', ['get', 'lastValue']],
      ...generateColorStops(maxColorValue, isDark).flat(),
    ],
    isDark ? unusedBorderColor : unusedColor,
  ];
}
