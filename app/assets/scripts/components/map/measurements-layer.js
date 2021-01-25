import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import { coloredSymbolSize, borderSymbolSize } from '../../utils/map-settings';
import { getFillExpression } from '../../utils/colors';
import { addPopover } from './map-interaction';
import { square, circle } from './symbols';

export default function MeasurementsLayer({
  activeParameter,
  country,
  map,
  sourceId,
}) {
  let match = useRouteMatch();

  const countryFilter = ['==', ['get', 'country'], country];
  const iconMatch = [
    'match',
    ['get', 'sensorType'],
    'low-cost sensor',
    'square',
    'reference',
    'circle',
    'circle', // fallback
  ];

  useEffect(() => {
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    if (!map.hasImage('circle')) map.addImage('circle', circle, { sdf: true });

    map.addLayer({
      id: `${activeParameter}-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': getFillExpression(activeParameter, 'dark'),
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': borderSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    map.addLayer({
      id: `${activeParameter}-layer`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': getFillExpression(activeParameter),
      },
      layout: {
        'icon-image': iconMatch,
        'icon-size': coloredSymbolSize,
        'icon-allow-overlap': true,
      },
    });

    addPopover(
      map,
      `${activeParameter}-layer`,
      match.params.id,
      activeParameter
    );

    return () => {
      if (map.getLayer(`${activeParameter}-layer`))
        map.removeLayer(`${activeParameter}-layer`);
      if (map.getLayer(`${activeParameter}-outline`))
        map.removeLayer(`${activeParameter}-outline`);
    };
  }, [sourceId, activeParameter]);

  useEffect(() => {
    if (country && map.getLayer(`${activeParameter}-layer`)) {
      map.setFilter(`${activeParameter}-layer`, countryFilter);
      map.setFilter(`${activeParameter}-outline`, countryFilter);
    }
    return () => {
      if (map.getLayer(`${activeParameter}-outline`))
        map.setFilter(`${activeParameter}-outline`, null);
      if (map.getLayer(`${activeParameter}-layer`))
        map.setFilter(`${activeParameter}-layer`, null);
    };
  }, [country]);

  return null;
}

MeasurementsLayer.propTypes = {
  activeParameter: PropTypes.number.isRequired,
  country: PropTypes.string,
  sourceId: PropTypes.string,
  map: PropTypes.object,
};
