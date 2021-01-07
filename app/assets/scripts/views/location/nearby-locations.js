import React from 'react';
import PropTypes from 'prop-types';

import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import MeasurementsLayer from '../../components/map/measurements-layer';
import LocationLayer from '../../components/map/location-layer';
import Legend from '../../components/map/legend';

export default function NearbyLocations({
  locationId,
  center,
  city,
  country,
  parameters,
  activeParameter,
}) {
  console.log(activeParameter)
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
            <LocationsSource activeParameter={activeParameter}>
              <MeasurementsLayer activeParameter={activeParameter} />
              <LocationLayer
                activeParameter={activeParameter}
                locationId={locationId}
              />
            </LocationsSource>
            <Legend parameters={parameters} activeParameter={activeParameter} />
          </MapComponent>
        </div>
      </div>
    </section>
  );
}

NearbyLocations.propTypes = {
  locationId: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  parameters: PropTypes.array,
  city: PropTypes.string,
  country: PropTypes.string,
  activeParameter: PropTypes.string,
};
