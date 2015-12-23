// These are the visual breaks for the 6 severity groupings.
export const colorScale = ['#0CE700', '#FFFF00', '#FF6800', '#FF0000', '#87003B', '#6B0019'];
export const breaks = {
  'pm25': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: colorScale
  },
  'pm10': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: colorScale
  },
  'co': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: colorScale
  },
  'so2': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: colorScale
  },
  'no2': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: colorScale
  },
  'o3': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: colorScale
  },
  'bc': {
    massValues: [0, 20, 100, 200, 400, 600],
    numberValues: [0, 20, 100, 200, 400, 600],
    colors: colorScale
  }
};
export const millisecondsToOld = 6 * 60 * 60 * 1000; // 6 hours
