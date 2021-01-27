import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import {
  iconMatch,
  coloredSymbolSize,
  borderSymbolSize,
} from '../../utils/map-settings';
import { defaultColor, defaultBorderColor } from '../../utils/colors';
import { addPopover, debugProperties } from './map-interaction';
import { square, circle } from './symbols';

export default function LocationsLayer({ country, map, sourceId }) {
  let match = useRouteMatch();

  const countryFilter = ['==', ['get', 'country'], country];

  useEffect(() => {
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    if (!map.hasImage('circle')) map.addImage('circle', circle, { sdf: true });

    map.addLayer({
      id: 'locations-outline',
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': defaultBorderColor,
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': borderSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    map.addLayer({
      id: 'locations-layer',
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': defaultColor,
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': coloredSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    addPopover(map, 'locations-layer', match.params.id);

    //  DEBUGGING HELPER: shows properties on hover
    if (process.env.DS_ENV === 'development') {
      debugProperties(map, 'locations-layer');
    }

    return () => {
      if (map.getLayer('locations-layer')) map.removeLayer('locations-layer');
      if (map.getLayer('locations-outline'))
        map.removeLayer('locations-outline');
    };
  }, [sourceId]);

  useEffect(() => {
    if (country && map.getLayer('locations-layer')) {
      map.setFilter('locations-layer', countryFilter);
      map.setFilter('locations-outline', countryFilter);
    }
    return () => {
      if (map.getLayer('locations-outline'))
        map.setFilter('locations-outline', null);
      if (map.getLayer('locations-layer'))
        map.setFilter('locations-layer', null);
    };
  }, [country]);

  return null;
}

LocationsLayer.propTypes = {
  country: PropTypes.string,
  sourceId: PropTypes.string,
  map: PropTypes.object,
};
