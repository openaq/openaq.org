import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import mapbox from 'mapbox-gl';

import {
  defaultColor,
  circleOpacity,
  circleBlur,
  coloredCircleRadius,
  borderCircleRadius,
  coloredSquareSize,
  borderSquareSize,
} from '../../utils/map-settings';
import Popover from './popover';
import { square } from './square';

export default function DatasetLayer({
  activeParameter,
  isAllLocations,
  locationIds,
  map,
  sourceId,
  selectedLocations,
  handleLocationSelection,
}) {
  let match = useRouteMatch();

  const circlesFilter = ['==', ['get', 'isMobile'], false];
  const squaresFilter = ['==', ['get', 'isMobile'], true];
  const locationIdFilter = [
    'in',
    ['number', ['get', 'locationId']],
    ['literal', locationIds],
  ];
  const circlesLocationIdFilter = ['all', locationIdFilter, circlesFilter];
  const squaresLocationIdFilter = ['all', locationIdFilter, squaresFilter];

  useEffect(() => {
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    map.addLayer({
      id: `${activeParameter}-square-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': defaultColor,
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
        'icon-color': defaultColor,
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
        'circle-color': defaultColor,
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
        'circle-color': defaultColor,
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
  }, [activeParameter]);

  useEffect(() => {
    const openPopup = e => {
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
          handleLocationSelection={handleLocationSelection}
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
  }, [isAllLocations, selectedLocations, activeParameter]);

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
  }, [locationIds, activeParameter]);

  return null;
}

DatasetLayer.propTypes = {
  activeParameter: PropTypes.number.isRequired,
  isAllLocations: PropTypes.bool.isRequired,
  locationIds: PropTypes.array,
  sourceId: PropTypes.string,
  map: PropTypes.object,
  selectedLocations: PropTypes.object,
  handleLocationSelection: PropTypes.func,
};
