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

// The max values are there to keep the scale from getting skewed too high.
// So for example if New Delhi has really bad pollution one day,
// it’d make everywhere else look good, which would not be true
// That’s why there is some physical value above which everything is bad.
export const parameterMax = {
  'pm25': 110,
  'pm10': 275,
  'co': 11,
  'no2': 0.65,
  'so2': 0.22,
  'o3': 0.165,
  'bc': 3
};

// The units the params must be converted to to be displayed.
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

export function convertParamIfNeeded (parameter) {
  let value = parameter.value;
  let p = parameter.parameter;
  if (Object.keys(parameterConversion).indexOf(p) !== -1 &&
    parameter.unit !== parameterUnit[p]) {
    value *= parameterConversion[p];
  }
  return value;
}
