import { useEffect } from 'react';
import PropTypes from 'prop-types';
import mapbox from 'mapbox-gl';

export default function MobilePointsLayer({
  locationId,
  locationIds,
  dateRange,
  map,
  sourceId,
}) {
  const colorExpression = [
    'case',
    [
      'all',
      ['has', 'lastUpdated'],
      ['>=', ['get', 'lastUpdated'], ['literal', dateRange.start]],
      ['<=', ['get', 'lastUpdated'], ['literal', dateRange.end]],
    ],
    '#198CFF',
    '#555555',
  ];

  useEffect(() => {
    map.addLayer({
      id: 'mobile-points',
      source: sourceId,
      'source-layer': 'default',
      type: 'circle',
      paint: {
        'circle-color': colorExpression,
        'circle-radius': 5,
        'circle-opacity': 0.6,
      },
    });

    //  DEBUGGING HELPER: shows properties on hover
    if (process.env.DS_ENV === 'development') {
      displayProperties(map);
    }

    return () => {
      if (map.getLayer('mobile-points')) map.removeLayer('mobile-points');
    };
  }, []);

  useEffect(() => {
    map.setPaintProperty('mobile-points', 'circle-color', colorExpression);
  }, [dateRange]);

  useEffect(() => {
    if (locationId && map.getLayer('mobile-points'))
      map.setFilter('mobile-points', ['==', 'locationId', locationId]);
    return () => {
      if (map.getLayer('mobile-points')) map.setFilter('mobile-points', null);
    };
  }, [locationId]);

  useEffect(() => {
    if (locationIds && map.getLayer('mobile-points'))
      map.setFilter('mobile-points', [
        'in',
        ['get', 'locationId'],
        ['literal', locationIds],
      ]);
    return () => {
      if (map.getLayer('mobile-points')) map.setFilter('mobile-points', null);
    };
  }, [locationIds]);

  return null;
}

MobilePointsLayer.propTypes = {
  locationIds: PropTypes.arrayOf(PropTypes.number),
  map: PropTypes.object,
  sourceId: PropTypes.string,
  dateRange: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }).isRequired,
};

function displayProperties(map) {
  var popup = new mapbox.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.on('mouseenter', 'mobile-points', function (e) {
    map.getCanvas().style.cursor = 'pointer';

    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = JSON.stringify(e.features[0].properties);

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on('mouseleave', 'mobile-points', function () {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
}
