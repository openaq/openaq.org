import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import MeasurementsLayer from '../../components/map/measurements-layer';
import LocationLayer from '../../components/map/location-layer';
import Legend from '../../components/map/legend';

export default function NearbyLocations({
  locationId,
  center,
  parameters,
  initialActiveParameter,
}) {
  const [activeParameter, setActiveParameter] = useState(
    initialActiveParameter
  );

  const onParamSelection = paramId => {
    setActiveParameter(parameters.find(param => param.parameterId === paramId));
  };

  return (
    <section className="fold" id="location-fold-nearby">
      <div className="inner">
        <header className="fold__header">
          <h1 className="fold__title">Nearby locations</h1>
        </header>
        <div className="fold__body">
          <MapComponent scrollZoomDisabled={false} center={center}>
            <LocationsSource activeParameter={activeParameter.parameterId}>
              <MeasurementsLayer
                activeParameter={activeParameter.parameterId}
                center={center}
              />
              <LocationLayer
                activeParameter={activeParameter.parameterId}
                locationIds={[locationId]}
              />
            </LocationsSource>
            <Legend
              paramIds={parameters.map(p => p.parameterId)}
              activeParameter={activeParameter}
              onParamSelection={onParamSelection}
            />
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
  initialActiveParameter: PropTypes.object,
};
