// Color scales
export const colorScale = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];

 // Point at which measurements should be considered old
export const millisecondsToOld = 24 * 60 * 60 * 1000;

// The max value to clamp to per parameter
export const parameterMax = {
  'pm25': 150,
  'pm10': 350,
  'co': 15.4,
  'no2': 0.65,
  'so2': 0.3,
  'o3': 0.2,
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
