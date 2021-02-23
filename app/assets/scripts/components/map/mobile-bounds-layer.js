import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import { getFillExpression, defaultBorderColor } from '../../utils/colors';
import { addPopover, debugProperties } from './map-interaction';
import { ParameterContext } from '../../context/parameter-context';

export default function MobileBoundsLayer({
  locationId,
  locationIds,
  country,
  activeParameter,
  map,
  sourceId,
}) {
  let match = useRouteMatch();
  const { getMaxColorValue } = useContext(ParameterContext);

  const countryFilter = ['==', ['get', 'country'], country];

  useEffect(() => {
    const maxColorValue = getMaxColorValue(activeParameter);
    map.addLayer({
      id: `mobile-bounds-${activeParameter}`,
      source: sourceId,
      'source-layer': 'bounds',
      type: 'line',
      paint: {
        'line-color': activeParameter
          ? getFillExpression(maxColorValue)
          : defaultBorderColor,
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

    //  DEBUGGING HELPER: shows properties on hover
    if (process.env.DS_ENV === 'development') {
      debugProperties(map, `mobile-bounds-${activeParameter}`);
    }

    return () => {
      if (map.getLayer(`mobile-bounds-${activeParameter}`)) {
        map.removeLayer(`mobile-bounds-${activeParameter}`);
      }
    };
  }, [sourceId, activeParameter]);

  useEffect(() => {
    if (locationId && map.getLayer(`mobile-bounds-${activeParameter}`)) {
      map.setFilter(`mobile-bounds-${activeParameter}`, [
        '==',
        'locationId',
        locationId,
      ]);
    }
    return () => {
      if (map.getLayer(`mobile-bounds-${activeParameter}`)) {
        map.setFilter(`mobile-bounds-${activeParameter}`, null);
      }
    };
  }, [locationId]);

  useEffect(() => {
    if (locationIds && map.getLayer(`mobile-bounds-${activeParameter}`)) {
      map.setFilter(`mobile-bounds-${activeParameter}`, [
        'in',
        ['get', 'locationId'],
        ['literal', locationIds],
      ]);
    }
    return () => {
      if (map.getLayer(`mobile-bounds-${activeParameter}`)) {
        map.setFilter(`mobile-bounds-${activeParameter}`, null);
      }
    };
  }, [locationIds]);

  useEffect(() => {
    if (country && map.getLayer(`mobile-bounds-${activeParameter}`)) {
      map.setFilter(`mobile-bounds-${activeParameter}`, countryFilter);
    }
    return () => {
      if (map.getLayer(`mobile-bounds-${activeParameter}`)) {
        map.setFilter(`mobile-bounds-${activeParameter}`, null);
      }
    };
  }, [country]);

  return null;
}

MobileBoundsLayer.propTypes = {
  locationId: PropTypes.number,
  locationIds: PropTypes.arrayOf(PropTypes.number),
  activeParameter: PropTypes.number,
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
