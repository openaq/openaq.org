import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import mapbox from 'mapbox-gl';

import { ParameterProvider } from '../../context/parameter-context';
import config from '../../config';

export default function Map({
  center,
  bbox,
  scrollZoomDisabled,
  children,
  activeParameter,
  triggerCollocate,
  findNearbySensors,
}) {
  const containerRef = useRef();

  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map !== null) {
      var features = map.queryRenderedFeatures({
        layers: [`${activeParameter}-layer`],
      });
      findNearbySensors(features);
    }
  }, [triggerCollocate]);

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
        m.jumpTo({ center, zoom: 8 });
      } else if (bbox) {
        m.fitBounds(bbox, { padding: 20, maxZoom: 18 });
      }
    });

    var scale = new mapbox.ScaleControl({
      maxWidth: 200,
      unit: 'imperial',
    });
    m.addControl(scale);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div className="map" style={{ minHeight: `20rem` }}>
      <div ref={containerRef} className="map__container" data-cy="mapboxgl-map">
        <ParameterProvider>
          {map &&
            children &&
            React.Children.map(children, child =>
              React.cloneElement(child, {
                map,
              })
            )}
        </ParameterProvider>
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
  // TODO: move these elsewhere or make required
  activeParameter: PropTypes.string,
  triggerCollocate: PropTypes.bool,
  findNearbySensors: PropTypes.func,
};
