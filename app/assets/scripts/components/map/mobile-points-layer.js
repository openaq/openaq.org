import { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function MobilePointsLayer({
  locationId,
  locationIds,
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
        'circle-color': '#198CFF',
        'circle-radius': 5,
        'circle-opacity': 0.6,
      },
    });
    return () => {
      if (map.getLayer('mobile-points')) map.removeLayer('mobile-points');
    };
  }, []);

  useEffect(() => {
    if (locationId && map.getLayer('mobile-points'))
      map.setFilter('mobile-points', ['==', 'locationId', locationId]);
    return () => {
      if (map.getLayer('mobile-points')) map.setFilter('mobile-points', null);
    };
  }, [locationId]);

  useEffect(() => {
    if (locationIds && map.getLayer('mobile-points'))
      map.setFilter('mobile-points', [
        'in',
        ['get', 'locationId'],
        ['literal', locationIds],
      ]);
    return () => {
      if (map.getLayer('mobile-points')) map.setFilter('mobile-points', null);
    };
  }, [locationIds]);

  return null;
}

MobilePointsLayer.propTypes = {
  locationIds: PropTypes.arrayOf(PropTypes.number),
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
