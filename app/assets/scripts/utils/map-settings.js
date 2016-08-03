// Color scales
export const colorScale = ['#f7faf0', '#e0efda', '#cde6c4', '#abd9b5', '#7bccc4', '#4db3d2', '#2c8cbe', '#0769ad', '#1e4280'];
export const unusedColor = '#B3B3B3';

// Map styling
export const circleOpacity = 1;
export const circleBlur = {
  'stops': [[0, 0.8], [5, 0.5], [7, 0]]
};

// for default fill size for old measurements
export const unusedCircleRadius = {
  'stops': [[0, 2], [5, 5], [7, 8]]
};
// for default fill size
export const coloredCircleRadius = {
  'stops': [[0, 2], [5, 3], [7, 7]]
};
// for default border
export const borderCircleRadius = {
  'stops': [[0, 2.5], [5, 2.75], [7, 9]]
};
// for a selected points white highlight
export const selectCircleRadius = {
  'stops': [[0, 2.75], [5, 3.5], [7, 9]]
};
// for selected points shadow
export const selectShadowCircleRadius = {
  'stops': [[0, 3.5], [5, 4], [7, 12]]
};

export const parameterMax = {
  'pm25': 110,
  'pm10': 275,
  'co': 11,
  'no2': 0.65,
  'so2': 0.22,
  'o3': 0.165,
  'bc': 3
};

export const parameterUnit = {
  'pm25': 'µg/m³',
  'pm10': 'µg/m³',
  'co': 'ppm',
  'no2': 'ppm',
  'so2': 'ppm',
  'o3': 'ppm',
  'bc': 'µg/m³'
};

export const parameterConversion = {
  'co': 0.000904379,
  'no2': 0.000550492,
  'so2': 0.000395666,
  'o3': 0.000527554
};
