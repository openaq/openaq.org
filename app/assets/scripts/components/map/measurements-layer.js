import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import mapbox from 'mapbox-gl';

import config from '../../config';
import {
  circleOpacity,
  circleBlur,
  coloredCircleRadius,
  borderCircleRadius,
} from '../../utils/map-settings';
import { generateColorStops } from '../../utils/colors';
import Popover from './popover';

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
    if (!fetched || !data) {
      return;
    }
    // TODO: replace with MVT layer
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
          stops: generateColorStops(activeParameter.name.toLowerCase(), 'dark'),
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

    map.on('click', 'measurements-layer', function (e) {
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
          parameter={activeParameter.name}
          properties={e.features[0].properties}
        />,
        popoverElement
      );
      new mapbox.Popup()
        .setLngLat(coordinates)
        .setDOMContent(popoverElement)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the layer.
    map.on('mouseenter', 'measurements-layer', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'measurements-layer', function () {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.getLayer('measurements-layer'))
        map.removeLayer('measurements-layer');
      if (source) map.removeSouce('measurements-source');
    };
  }, [data]);

  return null;
}
