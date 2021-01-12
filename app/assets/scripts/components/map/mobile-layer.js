import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { unusedBorderColor } from '../../utils/colors';

export default function MobileLayer({ activeParameter, map, sourceId }) {
  useEffect(() => {
    map.addLayer({
      id: 'mobile-layer',
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
      if (map.getLayer('mobile-layer')) map.removeLayer('mobile-layer');
    };
  }, [activeParameter]);

  return null;
}

MobileLayer.propTypes = {
  activeParameter: PropTypes.string,
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
