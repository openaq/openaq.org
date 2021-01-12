import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { unusedBorderColor } from '../../utils/colors';

export default function MobilePointsLayer({
  locationId,
  activeParameter,
  map,
  sourceId,
}) {
  useEffect(() => {
    map.addLayer({
      id: 'mobile-points',
      source: sourceId,
      'source-layer': 'default',
      type: 'circle',
      paint: {
        'circle-color': unusedBorderColor,
        // to add once properties are included in vectore tiles
        // 'circle-color': getFillExpression(activeParameter),
        'circle-radius': 5,
        'circle-opacity': 0.6,
      },
    });

    return () => {
      if (map.getLayer('mobile-points')) map.removeLayer('mobile-points');
    };
  }, [activeParameter]);

  useEffect(() => {
    if (locationId && map.getLayer('mobile-points'))
      map.setFilter('mobile-points', ['==', 'locationId', locationId]);
    return () => {
      map.setFilter('mobile-points', null);
    };
  }, [locationId]);

  return null;
}

MobilePointsLayer.propTypes = {
  activeParameter: PropTypes.string,
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
