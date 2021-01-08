import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import mapbox from 'mapbox-gl';

import {
  circleOpacity,
  circleBlur,
  coloredCircleRadius,
  borderCircleRadius,
} from '../../utils/map-settings';
import { generateColorStops } from '../../utils/colors';
import Popover from './popover';

export default function MeasurementsLayer({
  activeParameter,
  country,
  map,
  sourceId,
}) {
  let match = useRouteMatch();

  useEffect(() => {
    map.addLayer({
      id: `${activeParameter}-outline`,
      source: sourceId,
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
      id: `${activeParameter}-layer`,
      source: sourceId,
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

    map.on('click', `${activeParameter}-layer`, function (e) {
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
    map.on('mouseenter', `${activeParameter}-layer`, function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', `${activeParameter}-layer`, function () {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.getLayer(`${activeParameter}-layer`))
        map.removeLayer(`${activeParameter}-layer`);
      if (map.getLayer(`${activeParameter}-outline`))
        map.removeLayer(`${activeParameter}-outline`);
    };
  }, [sourceId]);

  useEffect(() => {
    if (country && map.getLayer(`${activeParameter}-layer`)) {
      map.setFilter(`${activeParameter}-outline`, ['==', 'country', country]);
      map.setFilter(`${activeParameter}-layer`, ['==', 'country', country]);

      return () => {
        map.setFilter(`${activeParameter}-outline`, null);
        map.setFilter(`${activeParameter}-layer`, null);
      };
    }
  }, [country]);

  return null;
}

MeasurementsLayer.propTypes = {
  activeParameter: PropTypes.string.isRequired,
  country: PropTypes.string,
  sourceId: PropTypes.string,
  map: PropTypes.object,
};
