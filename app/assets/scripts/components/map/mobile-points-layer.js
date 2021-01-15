import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { unusedBorderColor } from '../../utils/colors';

export default function MobilePointsLayer({ map, sourceId }) {
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

    return () => {
      if (map.getLayer('mobile-points')) map.removeLayer('mobile-points');
    };
  }, []);

  return null;
}

MobilePointsLayer.propTypes = {
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
