import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';

import config from '../../config';

export default function LocationsSource({ activeParameter, map, children }) {
  const [sourceId, setSourceId] = useState(null);

  useEffect(() => {
    if (!map.getSource(`locations-source-${activeParameter}`)) {
      const query = {
        parameter: activeParameter,
      };
      map.addSource(`locations-source-${activeParameter}`, {
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

    setSourceId(`locations-source-${activeParameter}`);

    return () => {
      setSourceId(null);
    };
  }, [activeParameter]);

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

LocationsSource.propTypes = {
  activeParameter: PropTypes.string.isRequired,
  map: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
