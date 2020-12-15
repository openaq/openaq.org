import React from 'react';
import { PropTypes as T } from 'prop-types';

import MapComponent from './map';
import MeasurementsLayer from './map/measurements-layer';
import Legend from './map/legend';

export default function NearbyLocations({ city, country, parameters }) {
  return (
    <section className="fold" id="location-fold-nearby">
      <div className="inner">
        <header className="fold__header">
          <h1 className="fold__title">
            Nearby locations in {city}, {country}
          </h1>
        </header>
        <div className="fold__body">
          <MapComponent>
            <MeasurementsLayer activeParameter={{ id: 'pm25', name: 'pm25' }} />
            <Legend
              parameters={parameters}
              activeParameter={{ id: 'pm25', name: 'pm25' }}
            />
          </MapComponent>
        </div>
      </div>
    </section>
  );
}

NearbyLocations.propTypes = {
  measurements: T.array,
  parameters: T.array,
  city: T.string,
  country: T.string,
};
