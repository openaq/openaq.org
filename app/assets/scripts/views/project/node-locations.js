import React, { useState } from 'react';
import PropTypes from 'prop-types';

import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import NodeLayer from '../../components/map/node-layer';
import Legend from '../../components/map/legend';
import OptionCard from '../../components/map/option-card';

export default function NodeLocations({
  bbox,
  locationIds,
  parameters,
  toggleLocationSelection,
  isDisplayingSelectionTools,
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
            <NodeLayer
              activeParameter={activeParameter.parameterId}
              isDisplayingSelectionTools={isDisplayingSelectionTools}
              locationIds={locationIds}
              selectedLocations={selectedLocations}
              handleLocationSelection={handleLocationSelection}
            />
          </LocationsSource>

          <OptionCard
            toggleLocationSelection={toggleLocationSelection}
            isDisplayingSelectionTools={isDisplayingSelectionTools}
          />
          <Legend
            presetParameterList={parameters}
            activeParameter={activeParameter}
            onParamSelection={onParamSelection}
            showOnlyParam
          />
        </MapComponent>
      </div>
    </section>
  );
}

NodeLocations.propTypes = {
  locationIds: PropTypes.array.isRequired,
  center: PropTypes.arrayOf(PropTypes.number),
  parameters: PropTypes.array,
  city: PropTypes.string,
  bbox: PropTypes.array,
  activeParameter: PropTypes.string,
  isDisplayingSelectionTools: PropTypes.bool.isRequired,
  toggleLocationSelection: PropTypes.func.isRequired,
  selectedLocations: PropTypes.object,
  handleLocationSelection: PropTypes.func.isRequired,
};
