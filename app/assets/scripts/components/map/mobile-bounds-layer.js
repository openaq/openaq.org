import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { unusedBorderColor } from '../../utils/colors';

export default function MobileBoundsLayer({
  locationId,
  activeParameter,
  map,
  sourceId,
}) {
  useEffect(() => {
    map.addLayer({
      id: 'mobile-bounds',
      source: sourceId,
      'source-layer': 'bounds',
      type: 'line',
      paint: {
        'line-color': unusedBorderColor,
        // to add once properties are included in vectore tiles
        // 'line-color': getFillExpression(activeParameter),
        'line-width': 5,
        'line-opacity': 0.6,
      },
    });

    return () => {
      if (map.getLayer('mobile-bounds')) map.removeLayer('mobile-bounds');
    };
  }, [activeParameter]);

  useEffect(() => {
    if (locationId && map.getLayer('mobile-bounds'))
      map.setFilter('mobile-bounds', ['==', 'locationId', locationId]);
    return () => {
      map.setFilter('mobile-bounds', null);
    };
  }, [locationId]);

  return null;
}

MobileBoundsLayer.propTypes = {
  activeParameter: PropTypes.string,
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
