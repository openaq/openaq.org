import React from 'react';
import ReactDOM from 'react-dom';
import mapbox from 'mapbox-gl';

import Popover from './popover';

export function addPopover(
  map,
  layerId,
  locationId,
  activeParameter,
  popupFunction
) {
  // Change the cursor to a pointer when the mouse is over the layer.
  map.on('mouseenter', layerId, function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', layerId, function () {
    map.getCanvas().style.cursor = '';
  });

  const openPopup = e => {
    let popoverElement = document.createElement('div');
    var coordinates = e.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var features = map.queryRenderedFeatures();
    window.featuress = features;

    let lngLat = typeof coordinates[0] === 'number' ? coordinates : e.lngLat;
    ReactDOM.render(
      <Popover
        activeParameter={activeParameter}
        locationId={e.features[0].properties.locationId}
        currentPage={parseInt(locationId, 10)}
        popupFunction={popupFunction}
      />,
      popoverElement
    );
    new mapbox.Popup()
      .setLngLat(lngLat)
      .setDOMContent(popoverElement)
      .addTo(map);
  };

  map.on('click', layerId, openPopup);
}

export function debugProperties(map, layerId) {
  var popup = new mapbox.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on('mouseenter', layerId, function (e) {
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = JSON.stringify(e.features[0].properties);

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    let lngLat = typeof coordinates[0] === 'number' ? coordinates : e.lngLat;

    popup.setLngLat(lngLat).setHTML(description).addTo(map);
  });

  map.on('mouseleave', layerId, function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
}
