import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import { unusedBorderColor } from '../../utils/colors';
import { addPopover } from './map-interaction';

export default function MobileLayer({ activeParameter, map, sourceId }) {
  let match = useRouteMatch();

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

    addPopover(map, 'mobile-layer', match.params.id, activeParameter);

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
