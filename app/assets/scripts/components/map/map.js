import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import mapbox from 'mapbox-gl';

import config from '../../config';
import LoadingMessage from '../loading-message';

export default function Map({ center, bbox, scrollZoomDisabled, children }) {
  const containerRef = useRef();

  const [map, setMap] = useState(null);
  const [tilesLoaded, setTilesLoaded] = useState(false);

  useEffect(() => {
    mapbox.accessToken = config.mapbox.token;
    const m = new mapbox.Map({
      container: containerRef.current,
      style: config.mapbox.baseStyle,
      zoom: 1,
      center: [0, 0],
    });

    m.addControl(new mapbox.NavigationControl());

    if (scrollZoomDisabled) m.scrollZoom.disable();

    m.on('load', () => {
      setMap(m);

      if (process.env.DS_ENV === 'development') {
        // makes map accessible in console for debugging
        window.map = m;
      }

      if (center) {
        m.flyTo({ center, zoom: 15 });
      } else if (bbox) {
        m.fitBounds(bbox, { padding: 20 });
      }
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (map) setTilesLoaded(map.areTilesLoaded());
    return () => {
      setTilesLoaded(false);
    };
  }, [map && map.areTilesLoaded()]);

  return (
    <div className="map" style={{ minHeight: `20rem` }}>
      <div ref={containerRef} className="map__container" data-cy="mapboxgl-map">
        {map &&
          children &&
          React.Children.map(children, child =>
            React.cloneElement(child, {
              map,
            })
          )}
        {!tilesLoaded && (
          <div
            style={{
              position: `absolute`,
              top: `50%`,
              left: `50%`,
              transform: `translate(-50%, -50%)`,
              zIndex: 20,
            }}
          >
            <LoadingMessage type="minimal" />
          </div>
        )}
      </div>
    </div>
  );
}

Map.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  bbox: PropTypes.arrayOf(PropTypes.number),
  scrollZoomDisabled: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
