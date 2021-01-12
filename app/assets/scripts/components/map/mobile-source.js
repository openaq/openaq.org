import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';

import config from '../../config';

export default function MobileSource({ dateRange, map, children }) {
  const [sourceId, setSourceId] = useState(null);

  useEffect(() => {
    if (!map.getSource('mobile-source')) {
      const [year, month, day] = dateRange.split('/').map(Number);
      const query = {
        ...(dateRange
          ? {
              date_from: new Date(year, month - 1, day || 1),
              date_to: day
                ? new Date(year, month - 1, day + 1)
                : new Date(year, month, 0),
            }
          : {}),
      };

      map.addSource('mobile-source', {
        type: 'vector',
        tiles: [
          `${config.api}/locations/tiles/{z}/{x}/{y}.pbf?${qs.stringify(query, {
            skipNulls: true,
          })}`,
        ],
        minzoom: 0,
        maxzoom: 24,
        bounds: [-180, -90, 180, 90],
      });
    }

    setSourceId('mobile-source');

    return () => {
      setSourceId(null);
    };
  }, [dateRange]);

  return (
    <>
      {!!(map && sourceId && map.getSource(sourceId)) &&
        children &&
        React.Children.map(children, child =>
          React.cloneElement(child, {
            map: map,
            sourceId: sourceId,
          })
        )}
    </>
  );
}

MobileSource.propTypes = {
  dateRange: PropTypes.string.isRequired,
  map: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
