import { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  coloredCircleRadius,
  selectCircleRadius,
  selectShadowCircleRadius,
} from '../../utils/map-settings';
import { generateColorStops } from '../../utils/colors';

export default function LocationLayer({
  activeParameter,
  locationId,
  map,
  sourceId,
}) {
  useEffect(() => {
    if (!map.getLayer('location-layer')) {
      // Add Shadow
      map.addLayer({
        id: 'location-shadow',
        source: sourceId,
        'source-layer': 'default',
        filter: ['==', 'locationId', locationId],
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
        filter: ['==', 'locationId', locationId],
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
        filter: ['==', 'locationId', locationId],
        type: 'circle',
        paint: {
          'circle-color': {
            property: 'lastValue',
            stops: generateColorStops(activeParameter),
          },
          'circle-opacity': 1,
          'circle-radius': coloredCircleRadius,
          'circle-blur': 0,
        },
      });
    }

    return () => {
      if (map.getLayer('location-layer')) map.removeLayer('location-layer');
    };
  }, []);

  return null;
}

LocationLayer.propTypes = {
  locationId: PropTypes.number.isRequired,
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
