import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes as T } from 'prop-types';
import mapbox from 'mapbox-gl';

import {
  circleOpacity,
  circleBlur,
  coloredCircleRadius,
  borderCircleRadius,
} from '../../utils/map-settings';
import { generateColorStops } from '../../utils/colors';
import Popover from './popover';

export default function MeasurementsLayer({ activeParameter, map }) {
  useEffect(() => {
    map.addLayer({
      id: 'measurements-outline',
      source: 'locations-source',
      'source-layer': 'default',
      type: 'circle',
      paint: {
        'circle-color': {
          property: 'lastValue',
          stops: generateColorStops(activeParameter, 'dark'),
        },
        'circle-opacity': 1,
        'circle-radius': borderCircleRadius,
        'circle-blur': 0,
      },
    });

    map.addLayer({
      id: 'measurements-layer',
      source: 'locations-source',
      'source-layer': 'default',
      type: 'circle',
      paint: {
        'circle-color': {
          property: 'lastValue',
          stops: generateColorStops(activeParameter),
        },
        'circle-opacity': circleOpacity,
        'circle-radius': coloredCircleRadius,
        'circle-blur': circleBlur,
      },
    });

    map.on('click', 'measurements-layer', function (e) {
      const coordinates = e.features[0].geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      let popoverElement = document.createElement('div');
      ReactDOM.render(
        <Popover
          activeParameter={activeParameter}
          locationId={e.features[0].properties.locationId}
        />,
        popoverElement
      );
      new mapbox.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popoverElement)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the layer.
    map.on('mouseenter', 'measurements-layer', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'measurements-layer', function () {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.getLayer('measurements-layer'))
        map.removeLayer('measurements-layer');
      if (map.getLayer('measurements-outline'))
        map.removeLayer('measurements-outline');
    };
  }, []);

  return null;
}

MeasurementsLayer.propTypes = {
  activeParameter: T.string.isRequired,
  map: T.object.isRequired,
};
