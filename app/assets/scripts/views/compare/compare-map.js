import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import MeasurementsLayer from '../../components/map/measurements-layer';
import LocationLayer from '../../components/map/location-layer';
import Legend from '../../components/map/legend';

export default function CompareMap({
  locationId,
  center,
  parameters,
  initialActiveParameter,
  triggerCompareSearch,
  findNearbySensors,
  popupFunction,
}) {
  const [activeParameter, setActiveParameter] = useState(
    initialActiveParameter
  );

  const onParamSelection = paramId => {
    setActiveParameter(parameters.find(param => param.parameterId === paramId));
  };

  return (
    <section className="fold compare-map" id="location-fold-nearby">
      <div className="inner">
        <div className="fold__body">
          <MapComponent
            scrollZoomDisabled={true}
            center={center}
            triggerCompareSearch={triggerCompareSearch}
            activeParameter={activeParameter.parameterId}
            findNearbySensors={findNearbySensors}
          >
            <LocationsSource activeParameter={activeParameter.parameterId}>
              <MeasurementsLayer
                activeParameter={activeParameter.parameterId}
                popupFunction={popupFunction}
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

CompareMap.propTypes = {
  locationId: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  parameters: PropTypes.array,
  city: PropTypes.string,
  country: PropTypes.string,
  initialActiveParameter: PropTypes.object,
  triggerCompareSearch: PropTypes.bool,
  findNearbySensors: PropTypes.func,
  popupFunction: PropTypes.func,
};
