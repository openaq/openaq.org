import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import config from '../../config';

export default function LocationsSource({ activeParameter, map, children }) {
  const [sourceId, setSourceId] = useState(null);

  useEffect(() => {
    map.addSource(`locations-source-${activeParameter}`, {
      type: 'vector',
      tiles: [
        `${config.api}/locations/tiles/{z}/{x}/{y}.pbf?parameter=${activeParameter}`,
      ],
      minzoom: 0,
      maxzoom: 24,
      bounds: [-180, -90, 180, 90],
    });

    setSourceId(`locations-source-${activeParameter}`);

    return () => {
      if (map.getSource(`locations-source-${activeParameter}`)) {
        setSourceId(null);
        map.removeSource(`locations-source-${activeParameter}`);
      }
    };
  }, [activeParameter]);

  return (
    <>
      {map &&
        sourceId &&
        map.getSource(`locations-source-${activeParameter}`) &&
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
  map: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
