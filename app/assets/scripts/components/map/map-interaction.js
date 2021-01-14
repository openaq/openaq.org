import React from 'react';
import ReactDOM from 'react-dom';
import mapbox from 'mapbox-gl';

import Popover from './popover';

export function addPopover(map, layerId, locationId, activeParameter) {
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
    ReactDOM.render(
      <Popover
        activeParameter={activeParameter}
        locationId={e.features[0].properties.locationId}
        currentPage={parseInt(locationId, 10)}
      />,
      popoverElement
    );
    new mapbox.Popup()
      .setLngLat(e.lngLat)
      .setDOMContent(popoverElement)
      .addTo(map);
  };

  map.on('click', layerId, openPopup);
}
