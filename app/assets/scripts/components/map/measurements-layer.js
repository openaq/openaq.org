import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import { ParameterContext } from '../../context/parameter-context';
import {
  iconMatch,
  coloredSymbolSize,
  borderSymbolSize,
} from '../../utils/map-settings';
import {
  getFillExpression,
  defaultColor,
  defaultBorderColor,
} from '../../utils/colors';
import { addPopover, debugProperties } from './map-interaction';
import { square, circle } from './symbols';

export default function MeasurementsLayer({
  activeParameter,
  country,
  map,
  sourceId,
  popupFunction,
}) {
  let match = useRouteMatch();
  const { getMaxColorValue } = useContext(ParameterContext);

  const countryFilter = ['==', ['get', 'country'], country];
  useEffect(() => {
    console.log('measurements layer', sourceId, activeParameter);
    if (!map.hasImage('square')) map.addImage('square', square, { sdf: true });
    if (!map.hasImage('circle')) map.addImage('circle', circle, { sdf: true });

    const maxColorValue = getMaxColorValue(activeParameter);
    map.addLayer({
      id: `${activeParameter}-outline`,
      source: sourceId,
      'source-layer': 'default',
      type: 'symbol',
      paint: {
        'icon-color': maxColorValue
          ? getFillExpression(maxColorValue, 'dark')
          : defaultBorderColor,
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
        'icon-color': maxColorValue
          ? getFillExpression(maxColorValue)
          : defaultColor,
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
      activeParameter,
      popupFunction
    );

    //  DEBUGGING HELPER: shows properties on hover
    if (process.env.DS_ENV === 'development') {
      debugProperties(map, `${activeParameter}-layer`);
    }

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
  center: PropTypes.array,
};
