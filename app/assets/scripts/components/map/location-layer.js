import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { ParameterContext } from '../../context/parameter-context';
import {
  iconMatch,
  coloredSymbolSize,
  selectSymbolSize,
  selectShadowSymbolSize,
} from '../../utils/map-settings';
import { getFillExpression, defaultColor } from '../../utils/colors';
import { square, circle } from './symbols';

export default function LocationLayer({
  activeParameter,
  locationIds,
  map,
  sourceId,
}) {
  const { isCore } = useContext(ParameterContext);

  useEffect(() => {
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    if (!map.hasImage('circle')) map.addImage('circle', circle, { sdf: true });

    // Add Shadow
    map.addLayer({
      id: 'location-shadow',
      source: sourceId,
      'source-layer': 'default',
      filter: ['in', ['get', 'locationId'], ['literal', locationIds]],
      type: 'symbol',
      paint: {
        'icon-color': '#000',
        'icon-opacity': 0.3,
        'icon-halo-blur': 0.5,
        'icon-translate': [0.5, 0.5],
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': selectShadowSymbolSize,
        'icon-allow-overlap': true,
      },
    });
    // Add Highlight
    map.addLayer({
      id: 'location-highlight',
      source: sourceId,
      'source-layer': 'default',
      filter: ['in', ['get', 'locationId'], ['literal', locationIds]],
      type: 'symbol',
      paint: {
        'icon-color': '#fff',
        'icon-opacity': 1,
        'icon-halo-blur': 0,
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': selectSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    // Re-add fill by value
    map.addLayer({
      id: 'location-layer',
      source: sourceId,
      'source-layer': 'default',
      filter: ['in', ['get', 'locationId'], ['literal', locationIds]],
      type: 'symbol',
      paint: {
        'icon-color': isCore(activeParameter)
          ? getFillExpression(activeParameter)
          : defaultColor,
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': coloredSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    return () => {
      if (map.getLayer('location-layer')) map.removeLayer('location-layer');
      if (map.getLayer('location-showdow')) map.removeLayer('location-showdow');
      if (map.getLayer('location-highlight'))
        map.removeLayer('location-highlight');
    };
  }, []);

  return null;
}

LocationLayer.propTypes = {
  locationIds: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  map: PropTypes.object,
  sourceIds: PropTypes.array,
};
