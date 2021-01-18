import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import qs from 'qs';

import config from '../config';
import { HeaderMessage } from '../components/header';
import MapComponent from '../components/map';
import LocationsSource from '../components/map/locations-source';
import MeasurementsLayer from '../components/map/measurements-layer';
import MobileBoundsLayer from '../components/map/mobile-bounds-layer';
import Legend from '../components/map/legend';
import { parameterMax } from '../utils/map-settings';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  parameters: null,
};

function WorldMap({ location, history }) {
  const [{ fetched, fetching, error, parameters }, setState] = useState(
    defaultState
  );
  const setActiveParamUrl = parameter => {
    history.push(`${location.pathname}?parameter=${parameter}`);
  };

  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetching: true, error: null }));

      fetch(`${config.api}/parameters`)
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
              parameters: json.results.filter(p =>
                Object.keys(parameterMax).includes(p.id.toString())
              ),
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

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return (
      <HeaderMessage>
        <h1>Take a deep breath.</h1>
        <div className="prose prose--responsive">
          <p>Parameter data is loading...</p>
        </div>
      </HeaderMessage>
    );
  }

  if (error || !parameters) {
    return (
      <HeaderMessage>
        <h1>Uh oh, something went wrong.</h1>
        <div className="prose prose--responsive">
          <p>
            There was a problem getting the data. If you continue to have
            problems, please let us know.
          </p>
          <p>
            <a href="mailto:info@openaq.org" title="Send us an email">
              Send us an Email
            </a>
          </p>
        </div>
      </HeaderMessage>
    );
  }

  const queryParameter = qs.parse(location.search, { ignoreQueryPrefix: true })
    .parameter;
  const activeParameter = _.find(parameters, {
    id: Number(queryParameter) || 2,
  });

  return (
    <section className="inpage">
      <header className="inpage__header">
        <div className="inner">
          <div className="inpage__headline">
            <h1 className="inpage__title">Map</h1>
          </div>
        </div>
      </header>
      <div className="inpage__body">
        <MapComponent>
          <LocationsSource activeParameter={activeParameter.id}>
            <MobileBoundsLayer activeParameter={activeParameter.id} />
            <MeasurementsLayer activeParameter={activeParameter.id} />
          </LocationsSource>
          <Legend
            parameters={parameters}
            activeParameter={activeParameter}
            onParamSelection={setActiveParamUrl}
          />
        </MapComponent>
      </div>
    </section>
  );
}

WorldMap.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default WorldMap;
