import React from 'react';
import { PropTypes as T } from 'prop-types';

import MapComponent from './map';
import MeasurementsLayer from './map/measurements-layer';
import Legend from './map/legend';

export default function NearbyLocations({
  center,
  city,
  country,
  parameters,
  activeParameter,
}) {
  return (
    <section className="fold" id="location-fold-nearby">
      <div className="inner">
        <header className="fold__header">
          <h1 className="fold__title">
            Nearby locations in {city}, {country}
          </h1>
        </header>
        <div className="fold__body">
          <MapComponent center={center}>
            <MeasurementsLayer activeParameter={activeParameter} />
            <Legend parameters={parameters} activeParameter={activeParameter} />
          </MapComponent>
        </div>
      </div>
    </section>
  );
}

NearbyLocations.propTypes = {
  center: T.arrayOf(T.number),
  parameters: T.array,
  city: T.string,
  country: T.string,
  activeParameter: T.string,
};
