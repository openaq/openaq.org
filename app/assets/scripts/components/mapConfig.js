// Color scales
export const colorScale = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];

 // Point at which measurements should be considered old
export const millisecondsToOld = 24 * 60 * 60 * 1000;

// The max value to clamp to per parameter
export const parameterMax = {
  'pm25': 200,
  'pm10': 200,
  'co': 200,
  'no2': 200,
  'so2': 200,
  'o3': 200,
  'bc': 200
};
