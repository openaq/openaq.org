import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import mapbox from 'mapbox-gl';
import moment from 'moment';

import {
  circleOpacity,
  circleBlur,
  coloredCircleRadius,
  borderCircleRadius,
  coloredSquareSize,
  borderSquareSize,
} from '../../utils/map-settings';
import {
  generateColorStops,
  unusedColor,
  unusedBorderColor,
} from '../../utils/colors';
import Popover from './popover';

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

  const countryFilter = ['==', 'country', country];
  const circlesFilter = ['==', 'isMobile', false];
  const squaresFilter = ['==', 'isMobile', true];
  const locationIdFilter = [
    'in',
    ['number', ['get', 'locationId']],
    ['literal', locationIds],
  ];
  const circlesCountryFilter = ['all', countryFilter, circlesFilter];
  const squaresCountryFilter = ['all', countryFilter, squaresFilter];
  const circlesLocationIdFilter = ['all', locationIdFilter, circlesFilter];
  const squaresLocationIdFilter = ['all', locationIdFilter, squaresFilter];

  const weekAgo = moment().subtract(7, 'days').toISOString();
  const fillExpression = isDark => [
    'case',
    ['>', ['get', 'lastUpdated'], ['literal', weekAgo]],
    [
      'interpolate',
      ['linear'],
      ['number', ['get', 'lastValue']],
      ...generateColorStops(activeParameter, isDark).flat(),
    ],
    isDark ? unusedBorderColor : unusedColor,
  ];

  useEffect(() => {
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    map.addLayer({
      id: `${activeParameter}-square-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': fillExpression('dark'),
      },
      layout: {
        'icon-image': 'square',
        'icon-size': borderSquareSize,
        'icon-allow-overlap': true,
      },
      filter: squaresFilter,
    });

    map.addLayer({
      id: `${activeParameter}-squares`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': fillExpression(),
      },
      layout: {
        'icon-image': 'square',
        'icon-size': coloredSquareSize,
        'icon-allow-overlap': true,
      },
      filter: squaresFilter,
    });

    map.addLayer({
      id: `${activeParameter}-circle-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'circle',
      paint: {
        'circle-color': fillExpression('dark'),
        'circle-opacity': 1,
        'circle-radius': borderCircleRadius,
        'circle-blur': 0,
      },
      filter: circlesFilter,
    });

    map.addLayer({
      id: `${activeParameter}-circles`,
      source: sourceId,
      'source-layer': 'default',
      type: 'circle',
      paint: {
        'circle-color': fillExpression(),
        'circle-opacity': circleOpacity,
        'circle-radius': coloredCircleRadius,
        'circle-blur': circleBlur,
      },
      filter: circlesFilter,
    });

    // Change the cursor to a pointer when the mouse is over the layer.
    map.on('mouseenter', `${activeParameter}-circles`, function () {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseenter', `${activeParameter}-squares`, function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', `${activeParameter}-circles`, function () {
      map.getCanvas().style.cursor = '';
    });
    map.on('mouseleave', `${activeParameter}-squares`, function () {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.getLayer(`${activeParameter}-squares`))
        map.removeLayer(`${activeParameter}-squares`);
      if (map.getLayer(`${activeParameter}-square-outline`))
        map.removeLayer(`${activeParameter}-square-outline`);
      if (map.getLayer(`${activeParameter}-circles`))
        map.removeLayer(`${activeParameter}-circles`);
      if (map.getLayer(`${activeParameter}-circle-outline`))
        map.removeLayer(`${activeParameter}-circle-outline`);
    };
  }, [sourceId, activeParameter]);

  useEffect(() => {
    const openPopup = function (e) {
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
    };

    map.on('click', `${activeParameter}-circles`, openPopup);
    map.on('click', `${activeParameter}-squares`, openPopup);
  }, [isAllLocations, selectedLocations]);

  useEffect(() => {
    if (country && map.getLayer(`${activeParameter}-circles`)) {
      map.setFilter(`${activeParameter}-square-outline`, squaresCountryFilter);
      map.setFilter(`${activeParameter}-squares`, squaresCountryFilter);
      map.setFilter(`${activeParameter}-circle-outline`, circlesCountryFilter);
      map.setFilter(`${activeParameter}-circles`, circlesCountryFilter);
    }
    return () => {
      if (map.getLayer(`${activeParameter}-square-outline`))
        map.setFilter(`${activeParameter}-square-outline`, squaresFilter);
      if (map.getLayer(`${activeParameter}-squares`))
        map.setFilter(`${activeParameter}-squares`, squaresFilter);
      if (map.getLayer(`${activeParameter}-circle-outline`))
        map.setFilter(`${activeParameter}-circle-outline`, circlesFilter);
      if (map.getLayer(`${activeParameter}-circles`))
        map.setFilter(`${activeParameter}-circles`, circlesFilter);
    };
  }, [country]);

  useEffect(() => {
    if (
      locationIds &&
      locationIds.length &&
      map.getLayer(`${activeParameter}-circles`)
    ) {
      map.setFilter(
        `${activeParameter}-square-outline`,
        squaresLocationIdFilter
      );
      map.setFilter(`${activeParameter}-squares`, squaresLocationIdFilter);
      map.setFilter(
        `${activeParameter}-circle-outline`,
        circlesLocationIdFilter
      );
      map.setFilter(`${activeParameter}-circles`, circlesLocationIdFilter);
    }
    return () => {
      if (map.getLayer(`${activeParameter}-square-outline`))
        map.setFilter(`${activeParameter}-square-outline`, squaresFilter);
      if (map.getLayer(`${activeParameter}-squares`))
        map.setFilter(`${activeParameter}-squares`, squaresFilter);
      if (map.getLayer(`${activeParameter}-circle-outline`))
        map.setFilter(`${activeParameter}-circle-outline`, circlesFilter);
      if (map.getLayer(`${activeParameter}-circles`))
        map.setFilter(`${activeParameter}-circles`, circlesFilter);
    };
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
