import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import config from '../../config';

export default function LocationsSource({ activeParameter, map, children }) {
  const [source, setSource] = useState(null);

  useEffect(() => {
    let s = map.addSource('locations-source', {
      type: 'vector',
      tiles: [
        `${config.api}/locations/tiles/{z}/{x}/{y}.pbf?parameter=${activeParameter}`,
      ],
      minzoom: 0,
      maxzoom: 24,
      bounds: [-180, -90, 180, 90],
    });

    setSource(s);
  }, []);

  return (
    <>
      {source &&
        children &&
        React.Children.map(children, child =>
          React.cloneElement(child, {
            map: map,
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
