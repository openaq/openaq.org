import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import {
  circleOpacity,
  circleBlur,
  coloredCircleRadius,
  borderCircleRadius,
  coloredSquareSize,
  borderSquareSize,
} from '../../utils/map-settings';
import { getFillExpression } from '../../utils/colors';
import { addPopover } from './map-interaction';
import { square } from './square';

export default function MeasurementsLayer({
  activeParameter,
  country,
  map,
  sourceId,
}) {
  let match = useRouteMatch();

  const countryFilter = ['==', ['get', 'country'], country];
  const circlesFilter = ['==', ['get', 'sensorType'], 'reference grade'];
  const squaresFilter = ['==', ['get', 'sensorType'], 'low-cost sensor'];

  const circlesCountryFilter = ['all', countryFilter, circlesFilter];
  const squaresCountryFilter = ['all', countryFilter, squaresFilter];

  useEffect(() => {
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    map.addLayer({
      id: `${activeParameter}-square-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': getFillExpression(activeParameter, 'dark'),
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
        'icon-color': getFillExpression(activeParameter),
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
        'circle-color': getFillExpression(activeParameter, 'dark'),
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
        'circle-color': getFillExpression(activeParameter),
        'circle-opacity': circleOpacity,
        'circle-radius': coloredCircleRadius,
        'circle-blur': circleBlur,
      },
      filter: circlesFilter,
    });

    addPopover(
      map,
      `${activeParameter}-squares`,
      match.params.id,
      activeParameter
    );
    addPopover(
      map,
      `${activeParameter}-circles`,
      match.params.id,
      activeParameter
    );

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

  return null;
}

MeasurementsLayer.propTypes = {
  activeParameter: PropTypes.number.isRequired,
  country: PropTypes.string,
  sourceId: PropTypes.string,
  map: PropTypes.object,
};
