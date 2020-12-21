import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import mapbox from 'mapbox-gl';

import Popover from './popover';
import { unusedBorderColor } from '../../utils/colors';

export default function MobileLayer({ map, sourceId }) {
  let match = useRouteMatch();

  useEffect(() => {
    map.addLayer({
      id: 'mobile-layer',
      source: sourceId,
      'source-layer': 'bounds',
      type: 'line',
      paint: {
        'line-color': unusedBorderColor,
        'line-width': 5,
        'line-opacity': 0.6,
      },
    });

    map.on('click', 'mobile-layer', function (e) {
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
          locationId={e.features[0].properties.locationId}
          currentPage={parseInt(match.params.id, 10)}
        />,
        popoverElement
      );
      new mapbox.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popoverElement)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the layer.
    map.on('mouseenter', 'mobile-layer', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'mobile-layer', function () {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.getLayer('mobile-layer')) map.removeLayer('mobile-layer');
    };
  }, []);

  return null;
}

MobileLayer.propTypes = {
  map: PropTypes.object,
  sourceId: PropTypes.string,
};
