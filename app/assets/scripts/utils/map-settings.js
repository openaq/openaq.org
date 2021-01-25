// Map styling
export const iconMatch = [
  'match',
  ['get', 'sensorType'],
  'low-cost sensor',
  'square',
  'reference grade',
  'circle',
  'circle', // fallback
];

export const circleOpacity = 1;
export const circleBlur = {
  stops: [
    [0, 0.8],
    [5, 0.5],
    [7, 0],
  ],
};

// Fill Radius for stations w/o measurements
export const unusedCircleRadius = {
  stops: [
    [0, 2],
    [5, 5],
    [7, 8],
  ],
};

// Fill Radius for all station points w/ values
export const coloredCircleRadius = {
  stops: [
    [0, 2.5],
    [5, 3.5],
    [7, 7.5],
  ],
};

// Fill Radius for all station points w/ values
export const coloredSymbolSize = {
  stops: [
    [0, 0.1],
    [5, 0.2],
    [7, 0.3],
  ],
};

// Border Radius for all points
export const borderCircleRadius = {
  stops: [
    [0, 2.7],
    [5, 4],
    [7, 9],
    [9, 9.5],
  ],
};

// Border for all squares
export const borderSymbolSize = {
  stops: [
    [0, 0.15],
    [5, 0.25],
    [7, 0.35],
  ],
};

// Border Radius for the white outline around selected points
export const selectCircleRadius = {
  stops: [
    [0, 2.8],
    [5, 4.5],
    [7, 9.5],
  ],
};

// Fill Radius for the shadow around selected points
export const selectShadowCircleRadius = {
  stops: [
    [0, 3.5],
    [5, 6],
    [7, 12],
  ],
};

// Fill Radius for the shadow around the point a location page is on
export const locationShadowCircleRadius = {
  stops: [
    [0, 4],
    [5, 7],
    [7, 14],
  ],
};

// The max values are there to keep the scale from getting skewed too high.
// So for example if New Delhi has really bad pollution one day,
// it’d make everywhere else look good, which would not be true
// That’s why there is some physical value above which everything is bad.
export const parameterMax = {
  2: 110,
  1: 275,
  8: 11,
  7: 0.65,
  9: 0.22,
  10: 0.165,
  11: 3,
};

// The units the params must be converted to to be displayed.
export const parameterUnit = {
  2: 'µg/m³',
  1: 'µg/m³',
  8: 'ppm',
  7: 'ppm',
  9: 'ppm',
  10: 'ppm',
  11: 'µg/m³',
};

export const parameterConversion = {
  8: 0.000904379,
  7: 0.000550492,
  9: 0.000395666,
  10: 0.000527554,
};

export function convertParamIfNeeded(parameter) {
  let value = parameter.value;
  let p = parameter.parameter;
  if (
    Object.keys(parameterConversion).indexOf(p) !== -1 &&
    parameter.unit !== parameterUnit[p]
  ) {
    value *= parameterConversion[p];
  }
  return value;
}
