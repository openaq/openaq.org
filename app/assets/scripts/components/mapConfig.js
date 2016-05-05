// Color scales
export const colorScale = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
export const unusedColor = '#B3B3B3';

// Map styling
export const circleOpacity = {
  'stops': [[0, 0.8], [7, 0.6], [11, 0.4]]
};
export const unusedCircleRadius = {
  'stops': [[0, 2], [5, 5], [7, 8]]
};
export const coloredCircleRadius = {
  'stops': [[0, 4], [5, 5], [7, 8]]
};
export const circleBlur = {
  'stops': [[0, 0.8], [5, 0.5], [7, 0]]
};

 // Point at which measurements should be considered old
export const millisecondsToOld = 24 * 60 * 60 * 1000;

// The max value to clamp to per parameter
export const parameterMax = {
  'pm25': 110,
  'pm10': 275,
  'co': 11,
  'no2': 0.65,
  'so2': 0.22,
  'o3': 0.165,
  'bc': 3
};

// The unit to show per parameter
export const parameterUnit = {
  'pm25': 'µg/m³',
  'pm10': 'µg/m³',
  'co': 'ppm',
  'no2': 'ppm',
  'so2': 'ppm',
  'o3': 'ppm',
  'bc': 'µg/m³'
};

// Conversion factor from ug/m3 to ppm
export const parameterConversion = {
  'co': 0.000904379,
  'no2': 0.000550492,
  'so2': 0.000395666,
  'o3': 0.000527554
};
