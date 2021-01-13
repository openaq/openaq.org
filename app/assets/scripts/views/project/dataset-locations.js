import React, { useState } from 'react';
import PropTypes from 'prop-types';

import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import MeasurementsLayer from '../../components/map/measurements-layer';
import Legend from '../../components/map/legend';
import OptionCard from '../../components/map/option-card';

export default function DatasetLocations({
  bbox,
  locationIds,
  parameters,
  toggleAllLocations,
  isAllLocations,
  selectedLocations,
  handleLocationSelection,
}) {
  const [activeParameter, setActiveParameter] = useState(parameters[0]);

  const onParamSelection = paramId => {
    setActiveParameter(parameters.find(param => param.parameterId === paramId));
  };
  if (!activeParameter) {
    return null;
  }
  return (
    <section id="location-fold-dataset">
      <div className="fold__body">
        <MapComponent bbox={bbox}>
          <LocationsSource activeParameter={activeParameter.parameterId}>
            <MeasurementsLayer
              activeParameter={activeParameter.parameterId}
              isAllLocations={isAllLocations}
              locationIds={locationIds}
              selectedLocations={selectedLocations}
              handleLocationSelection={handleLocationSelection}
            />
          </LocationsSource>

          <OptionCard
            toggleAllLocations={toggleAllLocations}
            isAllLocations={isAllLocations}
          />
          <Legend
            parameters={parameters}
            activeParameter={activeParameter}
            onParamSelection={onParamSelection}
          />
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
  bbox: PropTypes.array,
  activeParameter: PropTypes.string,
  isAllLocations: PropTypes.bool.isRequired,
  toggleAllLocations: PropTypes.func.isRequired,
  selectedLocations: PropTypes.array,
  handleLocationSelection: PropTypes.func.isRequired,
};
