import React from 'react';
import PropTypes from 'prop-types';

import { getCountryBbox } from '../../utils/countries';

import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import MeasurementsLayer from '../../components/map/measurements-layer';
import LocationLayer from '../../components/map/location-layer';
import Legend from '../../components/map/legend';
import OptionCard from '../../components/map/option-card';

export default function DatasetLocations({
  country,
  locationIds,
  parameters,
  activeParameter,
  toggleAllLocations,
  isAllLocations,
}) {
  return (
    <section className="fold" id="location-fold-dataset">
      <div className="fold__body">
        <MapComponent bbox={getCountryBbox(country)}>
          <LocationsSource activeParameter={activeParameter}>
            <MeasurementsLayer
              activeParameter={activeParameter}
              isAllLocations={isAllLocations}
            />
            {locationIds.map(location => (
              <LocationLayer
                activeParameter={activeParameter}
                locationId={location}
                key={location}
              />
            ))}
            {/* <LocationLayer
              activeParameter={activeParameter}
              locationId={locationIds[0]}
            /> */}
          </LocationsSource>

          <OptionCard
            toggleAllLocations={toggleAllLocations}
            isAllLocations={isAllLocations}
          />
          <Legend parameters={parameters} activeParameter={activeParameter} />
        </MapComponent>
      </div>
    </section>
  );
}

DatasetLocations.propTypes = {
  locationIds: PropTypes.array.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  parameters: PropTypes.array,
  city: PropTypes.string,
  country: PropTypes.string,
  activeParameter: PropTypes.string,
  isAllLocations: PropTypes.bool.isRequired,
  toggleAllLocations: PropTypes.func.isRequired,
};
