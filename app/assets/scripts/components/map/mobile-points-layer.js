import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { unusedBorderColor } from '../../utils/colors';

export default function MobilePointsLayer({ locationId, map, sourceId }) {
  useEffect(() => {
    map.addLayer({
      id: 'mobile-points',
      source: sourceId,
      'source-layer': 'default',
      type: 'circle',
      paint: {
        'circle-color': unusedBorderColor,
        'circle-radius': 5,
        'circle-opacity': 0.3,
      },
    });

    if (locationId) {
      map.addLayer({
        id: 'mobile-location-points',
        source: sourceId,
        'source-layer': 'default',
        type: 'circle',
        paint: {
          'circle-color': '#198CFF',
          'circle-radius': 5,
          'circle-opacity': 0.6,
        },
        filter: ['==', 'locationId', locationId],
      });
    }

    return () => {
      if (map.getLayer('mobile-points')) map.removeLayer('mobile-points');
      if (map.getLayer('mobile-location-points'))
        map.removeLayer('mobile-location-points');
    };
  }, [locationId]);

  return null;
}

MobilePointsLayer.propTypes = {
  locationId: PropTypes.number,
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
