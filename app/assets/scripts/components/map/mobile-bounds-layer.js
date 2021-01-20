import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import { getFillExpression, unusedBorderColor } from '../../utils/colors';
import { addPopover } from './map-interaction';

export default function MobileBoundsLayer({
  locationId,
  activeParameter,
  map,
  sourceId,
}) {
  let match = useRouteMatch();

  useEffect(() => {
    map.addLayer({
      id: `mobile-bounds-${activeParameter}`,
      source: sourceId,
      'source-layer': 'bounds',
      type: 'line',
      paint: {
        'line-color': activeParameter
          ? getFillExpression(activeParameter)
          : unusedBorderColor,
        'line-width': 5,
        'line-opacity': 0.6,
      },
    });

    addPopover(
      map,
      `mobile-bounds-${activeParameter}`,
      match.params.id,
      activeParameter
    );

    return () => {
      if (map.getLayer(`mobile-bounds-${activeParameter}`))
        map.removeLayer(`mobile-bounds-${activeParameter}`);
    };
  }, [sourceId, activeParameter]);

  useEffect(() => {
    if (locationId && map.getLayer(`mobile-bounds-${activeParameter}`))
      map.setFilter(`mobile-bounds-${activeParameter}`, [
        '==',
        'locationId',
        locationId,
      ]);
    return () => {
      map.setFilter(`mobile-bounds-${activeParameter}`, null);
    };
  }, [locationId]);

  return null;
}

MobileBoundsLayer.propTypes = {
  locationId: PropTypes.number,
  activeParameter: PropTypes.number,
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
