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
  coloredSquareSize,
  borderSquareSize,
} from '../../utils/map-settings';
import { generateColorStops } from '../../utils/colors';
import Popover from './popover';

export default function MeasurementsLayer({
  activeParameter,
  isAllLocations,
  country,
  locationIds,
  map,
  sourceId,
  selectedLocations,
  setSelectedLocations,
}) {
  let match = useRouteMatch();
  useEffect(() => {
    const square = {
      width: 12,
      height: 12,
      data: new Uint8Array(12 * 12 * 4),
      render: function () {
        const bytesPerPixel = 4;
        for (let x = 0; x < this.width; x++) {
          for (let y = 0; y < this.height; y++) {
            const offset = (y * this.width + x) * bytesPerPixel;
            this.data[offset + 0] = 0;
            this.data[offset + 1] = 128;
            this.data[offset + 2] = 128;
            this.data[offset + 3] = 255;
          }
        }

        // not sure why this needs an initial color, it is going to be repainted anyways
        return true;
      },
    };

    map.addImage('square', square, { sdf: true });

    map.addLayer({
      id: `${activeParameter}-square-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': {
          property: 'lastValue',
          stops: generateColorStops(activeParameter, 'dark'),
        },
      },
      layout: {
        'icon-image': 'square',
        'icon-size': borderSquareSize,
        'icon-allow-overlap': true,
      },
      filter: ['==', ['get', 'isMobile'], false],
    });

    map.addLayer({
      id: `${activeParameter}-squares`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': {
          property: 'lastValue',
          stops: generateColorStops(activeParameter),
        },
      },
      layout: {
        'icon-image': 'square',
        'icon-size': coloredSquareSize,
        'icon-allow-overlap': true,
      },
      filter: ['==', ['get', 'isMobile'], false],
    });

    map.addLayer({
      id: `${activeParameter}-circle-outline`,
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
      filter: ['==', ['get', 'isMobile'], true],
    });

    map.addLayer({
      id: `${activeParameter}-circles`,
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
      filter: ['==', ['get', 'isMobile'], true],
    });

    // Change the cursor to a pointer when the mouse is over the layer.
    map.on('mouseenter', `${activeParameter}-circles`, function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', `${activeParameter}-circles`, function () {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.getLayer(`${activeParameter}-circles`))
        map.removeLayer(`${activeParameter}-circles`);
      if (map.getLayer(`${activeParameter}-circle-outline`))
        map.removeLayer(`${activeParameter}-circle-outline`);
    };
  }, [sourceId]);

  useEffect(() => {
    map.on('click', `${activeParameter}-circles`, function (e) {
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
          isAllLocations={isAllLocations}
          locationId={e.features[0].properties.locationId}
          currentPage={parseInt(match.params.id, 10)}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
        />,
        popoverElement
      );
      new mapbox.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popoverElement)
        .addTo(map);
    });
  }, [isAllLocations, selectedLocations]);

  useEffect(() => {
    if (country && map.getLayer(`${activeParameter}-circles`)) {
      map.setFilter(`${activeParameter}-circle-outline`, [
        '==',
        'country',
        country,
      ]);
      map.setFilter(`${activeParameter}-circles`, ['==', 'country', country]);

      return () => {
        map.setFilter(`${activeParameter}-circle-outline`, null);
        map.setFilter(`${activeParameter}-circles`, null);
      };
    }
  }, [country]);

  useEffect(() => {
    if (
      locationIds &&
      locationIds.length &&
      map.getLayer(`${activeParameter}-circles`)
    ) {
      map.setFilter(`${activeParameter}-circle-outline`, [
        'in',
        ['number', ['get', 'locationId']],
        ['literal', locationIds],
      ]);
      map.setFilter(`${activeParameter}-circles`, [
        'in',
        ['number', ['get', 'locationId']],
        ['literal', locationIds],
      ]);

      return () => {
        map.setFilter(`${activeParameter}-circle-outline`, null);
        map.setFilter(`${activeParameter}-circles`, null);
      };
    }
  }, [locationIds]);

  return null;
}

MeasurementsLayer.propTypes = {
  activeParameter: PropTypes.number.isRequired,
  isAllLocations: PropTypes.bool.isRequired,
  country: PropTypes.string,
  locationIds: PropTypes.array,
  sourceId: PropTypes.string,
  map: PropTypes.object,
};
