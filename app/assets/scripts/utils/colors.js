const mapColors = [
  { label: '0', color: '#f7faf0' },
  { label: '10', color: '#e0efda' },
  { label: '20', color: '#cde6c4' },
  { label: '30', color: '#abd9b5' },
  { label: '40', color: '#7bccc4' },
  { label: '50', color: '#4db3d2' },
  { label: '60', color: '#2c8cbe' },
  { label: '70', color: '#0769ad' },
  { label: '80', color: '#1e4280' }
];

export function getMapColors () {
  return mapColors;
}

export function getMapColorsHex () {
  return mapColors.map(o => o.color);
}

export function getMapColorsLabels () {
  return mapColors.map(o => o.label);
}

