import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import qs from 'qs';

import {
  ParameterContext,
  ParameterProvider,
} from '../context/parameter-context';

import { HeaderMessage } from '../components/header';
import MapComponent from '../components/map';
import MobileSource from '../components/map/mobile-source';
import LocationsSource from '../components/map/locations-source';
import MeasurementsLayer from '../components/map/measurements-layer';
import MobileBoundsLayer from '../components/map/mobile-bounds-layer';
import Legend from '../components/map/legend';
import { parameterMax } from '../utils/map-settings';

function WorldMap({ location, history }) {
  const { fetchedParams, fetchingParams, paramError, parameters } = useContext(
    ParameterContext
  );
  const setActiveParamUrl = parameter => {
    history.push(`${location.pathname}?parameter=${parameter}`);
  };

  if (!fetchedParams && !fetchingParams) {
    return null;
  }

  if (fetchingParams) {
    return (
      <HeaderMessage>
        <h1>Take a deep breath.</h1>
        <div className="prose prose--responsive">
          <p>Parameter data is loading...</p>
        </div>
      </HeaderMessage>
    );
  }

  if (paramError || !parameters) {
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
  const coreParameters = parameters.filter(p =>
    Object.keys(parameterMax).includes(p.id.toString())
  );
  const queryParameter = qs.parse(location.search, { ignoreQueryPrefix: true })
    .parameter;
  const activeParameter = _.find(coreParameters, {
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
          <MobileSource activeParameter={activeParameter.id}>
            <MobileBoundsLayer activeParameter={activeParameter.id} />
          </MobileSource>
          <LocationsSource activeParameter={activeParameter.id}>
            <MeasurementsLayer activeParameter={activeParameter.id} />
          </LocationsSource>
          <Legend
            presetParameterList={coreParameters}
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

function WorldMapWrapper(props) {
  return (
    <ParameterProvider>
      <WorldMap {...props} />
    </ParameterProvider>
  );
}

export default WorldMapWrapper;
