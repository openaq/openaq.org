import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { ParameterContext } from '../../context/parameter-context';
import {
  coloredCircleRadius,
  selectCircleRadius,
  selectShadowCircleRadius,
} from '../../utils/map-settings';
import { getFillExpression, defaultColor } from '../../utils/colors';

export default function LocationLayer({
  activeParameter,
  locationIds,
  map,
  sourceId,
}) {
  const { isCore } = useContext(ParameterContext);

  useEffect(() => {
    if (!map.getLayer('location-layer')) {
      // Add Shadow
      map.addLayer({
        id: 'location-shadow',
        source: sourceId,
        'source-layer': 'default',
        filter: ['in', ['get', 'locationId'], ['literal', locationIds]],
        type: 'circle',
        paint: {
          'circle-color': '#000',
          'circle-opacity': 0.3,
          'circle-radius': selectShadowCircleRadius,
          'circle-blur': 0.5,
          'circle-translate': [0.5, 0.5],
        },
      });
      // Add Highlight
      map.addLayer({
        id: 'location-highlight',
        source: sourceId,
        'source-layer': 'default',
        filter: ['in', ['get', 'locationId'], ['literal', locationIds]],
        type: 'circle',
        paint: {
          'circle-color': '#fff',
          'circle-opacity': 1,
          'circle-radius': selectCircleRadius,
          'circle-blur': 0,
        },
      });

      // Re-add fill by value
      map.addLayer({
        id: 'location-layer',
        source: sourceId,
        'source-layer': 'default',
        filter: ['in', ['get', 'locationId'], ['literal', locationIds]],
        type: 'circle',
        paint: {
          'circle-color': isCore(activeParameter)
            ? getFillExpression(activeParameter)
            : defaultColor,
          'circle-opacity': 1,
          'circle-radius': coloredCircleRadius,
          'circle-blur': 0,
        },
      });
    }

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
