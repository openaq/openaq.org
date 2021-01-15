import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import moment from 'moment';
import config from '../../config';

export default function MobileSource({
  firstUpdated,
  lastUpdated,
  map,
  children,
}) {
  const [sourceId, setSourceId] = useState(null);

  useEffect(() => {
    if (!map.getSource('mobile-source')) {
      const query = {
        dateFrom: moment(firstUpdated).subtract(1, 'd').format('YYYY-MM-DD'),
        dateTo: moment(lastUpdated).add(1, 'd').format('YYYY-MM-DD'),
      };
      map.addSource('mobile-source', {
        type: 'vector',
        tiles: [
          `${config.api}/locations/tiles/mobile/{z}/{x}/{y}.pbf?${qs.stringify(
            query,
            {
              skipNulls: true,
            }
          )}`,
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
  }, []);

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
  firstUpdated: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string.isRequired,
  map: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
