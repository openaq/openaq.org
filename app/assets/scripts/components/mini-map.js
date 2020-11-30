import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import mapbox from 'mapbox-gl';

import config from '../config';

export default function Map({ style, children }) {
  const containerRef = useRef();

  const [map, setMap] = useState(null);

  useEffect(() => {
    mapbox.accessToken = config.mapbox.token;
    const m = new mapbox.Map({
      container: containerRef.current,
      style: `mapbox://styles/mapbox/light-v10/`,
      zoom: 1,
      center: [0, 0],
    });

    m.on('load', () => {
      setMap(m);

      if (process.env.NODE_ENV === 'development') {
        // makes map accessible in console for debugging
        window.map = m;
      }
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div style={style} ref={containerRef} data-cy="mapboxgl-map">
      {map &&
        children &&
        React.Children.map(children, child =>
          React.cloneElement(child, {
            map,
          })
        )}
    </div>
  );
}

Map.propTypes = {
  style: PropTypes.shape({
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
  }),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
