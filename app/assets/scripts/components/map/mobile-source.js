import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import moment from 'moment';
import config from '../../config';

export default function MobileSource({
  activeParameter,
  locationId,
  firstUpdated,
  lastUpdated,
  map,
  children,
}) {
  const [sourceId, setSourceId] = useState(null);

  useEffect(() => {
    if (!map.getSource(`mobile-source-${activeParameter}`)) {
      const query = {
        parameter: activeParameter,
        location: locationId,
        dateFrom: firstUpdated
          ? moment(firstUpdated).subtract(1, 'd').format('YYYY-MM-DD')
          : null,
        dateTo: lastUpdated
          ? moment(lastUpdated).add(1, 'd').format('YYYY-MM-DD')
          : null,
      };

      map.addSource(`mobile-source-${activeParameter}`, {
        type: 'vector',
        tiles: [
          `${
            config.api
          }/locations/tiles/mobile-generalized/{z}/{x}/{y}.pbf?${qs.stringify(
            query,
            {
              skipNulls: true,
            }
          )}`,
        ],
        minzoom: 0,
        maxzoom: 24,
        bounds: [-180, -90, 180, 90],
      });
    }

    setSourceId(`mobile-source-${activeParameter}`);

    return () => {
      setSourceId(null);
    };
  }, [activeParameter]); // activeParameter is the only prop that could update without unmounting the component

  return (
    <>
      {!!(map && sourceId && map.getSource(sourceId)) &&
        children &&
        React.Children.map(children, child =>
          React.cloneElement(child, {
            map: map,
            sourceId: sourceId,
          })
        )}
    </>
  );
}

MobileSource.propTypes = {
  activeParameter: PropTypes.number,
  locationId: PropTypes.number,
  firstUpdated: PropTypes.string,
  lastUpdated: PropTypes.string,
  map: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
