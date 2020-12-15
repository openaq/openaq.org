import { useState, useEffect } from 'react';

import config from '../../config';
import {
  circleOpacity,
  circleBlur,
  coloredCircleRadius,
  borderCircleRadius,
} from '../../utils/map-settings';
import { generateColorStops } from '../../utils/colors';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

export default function MeasurementsLayer({ activeParameter, map }) {
  const [source, setSource] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetching: true, error: null }));

      // TODO: replace with MVT layer
      fetch(`${config.api}/locations?limit=1000&has_geo=true`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              data: json.results,
            }));
          },
          e => {
            console.log('e', e);
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              error: e,
            }));
          }
        );
    };

    fetchData();

    return () => {
      setState(defaultState);
    };
  }, []);

  useEffect(() => {
    if (fetched && data) {
      const geojson = {
        type: 'FeatureCollection',
        features: data
          .map(o =>
            o.coordinates
              ? {
                  type: 'Feature',
                  properties: {
                    location: o.name,
                    // Controls which color is applied to the point.
                    // Needs to be the points measurement.
                    value: o.parameters[0].lastValue,
                    lastUpdated: o.parameters[0].lastUpdated,
                  },
                  geometry: {
                    type: 'Point',
                    coordinates: [
                      o.coordinates.longitude,
                      o.coordinates.latitude,
                    ],
                  },
                }
              : null
          )
          .sort((a, b) => {
            return (
              new Date(a.properties.lastUpdated) -
              new Date(b.properties.lastUpdated)
            );
          }),
      };

      let s = map.getSource('measurements-source');
      if (!s) {
        s = map.addSource('measurements-source', {
          type: 'geojson',
          data: geojson,
        });
      } else {
        s.setData(geojson);
      }

      setSource(s);
      map.addLayer({
        id: 'measurements-outlines',
        source: 'measurements-source',
        type: 'circle',
        paint: {
          'circle-color': {
            property: 'value',
            stops: generateColorStops(
              activeParameter.name.toLowerCase(),
              'dark'
            ),
          },
          'circle-opacity': 1,
          'circle-radius': borderCircleRadius,
          'circle-blur': 0,
        },
      });

      map.addLayer({
        id: 'measurements-layer',
        source: 'measurements-source',
        type: 'circle',
        paint: {
          'circle-color': {
            property: 'value',
            stops: generateColorStops(activeParameter.name.toLowerCase()),
          },
          'circle-opacity': circleOpacity,
          'circle-radius': coloredCircleRadius,
          'circle-blur': circleBlur,
        },
      });
    }

    return () => {
      if (map.getLayer('measurements-layer'))
        map.removeLayer('measurements-layer');
      if (source) map.removeSouce('measurements-source');
    };
  }, [data]);

  return null;
}
