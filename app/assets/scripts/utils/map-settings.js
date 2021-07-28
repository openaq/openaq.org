// Map styling
export const iconMatch = [
  'match',
  ['get', 'sensorType'],
  'low-cost sensor',
  'square',
  // 'none',
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

export const selectSymbolSize = {
  stops: [
    [0, 0.28],
    [5, 0.38],
    [7, 0.48],
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

export const selectShadowSymbolSize = {
  stops: [
    [0, 0.3],
    [5, 0.4],
    [7, 0.5],
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
