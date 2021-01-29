import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import mapbox from 'mapbox-gl';

import {
  defaultColor,
  highlightColor,
  defaultBorderColor,
  highlightBorderColor,
} from '../../utils/colors';
import {
  iconMatch,
  borderSymbolSize,
  coloredSymbolSize,
} from '../../utils/map-settings';
// import { debugProperties } from './map-interaction';
import Popover from './popover';
import { square, circle } from './symbols';

export default function NodeLayer({
  activeParameter,
  isDisplayingSelectionTools,
  locationIds,
  map,
  sourceId,
  selectedLocations,
  handleLocationSelection,
}) {
  let match = useRouteMatch();

  const locationIdFilter = [
    'in',
    ['number', ['get', 'locationId']],
    ['literal', locationIds],
  ];

  const allSelectedLocations =
    selectedLocations && Object.values(selectedLocations).flat();

  useEffect(() => {
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    if (!map.hasImage('circle')) map.addImage('circle', circle, { sdf: true });

    map.addLayer({
      id: `${activeParameter}-node-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': [
          'case',
          [
            'in',
            ['number', ['get', 'locationId']],
            ['literal', allSelectedLocations],
          ],
          highlightBorderColor,
          defaultBorderColor,
        ],
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': borderSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    map.addLayer({
      id: `${activeParameter}-nodes`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': [
          'case',
          [
            'in',
            ['number', ['get', 'locationId']],
            ['literal', allSelectedLocations],
          ],
          highlightColor,
          defaultColor,
        ],
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': coloredSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    // Change the cursor to a pointer when the mouse is over the layer.
    map.on('mouseenter', `${activeParameter}-nodes`, function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', `${activeParameter}-nodes`, function () {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.getLayer(`${activeParameter}-nodes`))
        map.removeLayer(`${activeParameter}-nodes`);
      if (map.getLayer(`${activeParameter}-node-outline`))
        map.removeLayer(`${activeParameter}-node-outline`);
    };
  }, [activeParameter]);

  useEffect(() => {
    map.setPaintProperty(`${activeParameter}-nodes`, 'icon-color', [
      'case',
      [
        'in',
        ['number', ['get', 'locationId']],
        ['literal', allSelectedLocations],
      ],
      highlightColor,
      defaultColor,
    ]);
  }, [allSelectedLocations]);

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
          isDisplayingSelectionTools={isDisplayingSelectionTools}
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

    map.on('click', `${activeParameter}-nodes`, openPopup);

    //  DEBUGGING HELPER: shows properties on hover
    // if (process.env.DS_ENV === 'development') {
    //   debugProperties(map, `${activeParameter}-nodes`);
    // }
  }, [isDisplayingSelectionTools, selectedLocations, activeParameter]);

  useEffect(() => {
    if (
      locationIds &&
      locationIds.length &&
      map.getLayer(`${activeParameter}-nodes`)
    ) {
      map.setFilter(`${activeParameter}-node-outline`, locationIdFilter);
      map.setFilter(`${activeParameter}-nodes`, locationIdFilter);
    }
    return () => {
      if (map.getLayer(`${activeParameter}-node-outline`))
        map.setFilter(`${activeParameter}-node-outline`, null);
      if (map.getLayer(`${activeParameter}-nodes`))
        map.setFilter(`${activeParameter}-nodes`, null);
    };
  }, [locationIds, activeParameter]);

  return null;
}

NodeLayer.propTypes = {
  activeParameter: PropTypes.number.isRequired,
  isDisplayingSelectionTools: PropTypes.bool.isRequired,
  locationIds: PropTypes.array,
  sourceId: PropTypes.string,
  map: PropTypes.object,
  selectedLocations: PropTypes.object,
  handleLocationSelection: PropTypes.func,
};
