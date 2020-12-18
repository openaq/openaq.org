import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import Card, { CardHeader as BaseHeader, CardTitle } from '../card';
import TabbedSelector from '../tabbed-selector';
import Map from '../map';
import LocationsSource from '../map/locations-source';
import MobileLayer from '../map/mobile-layer';
import LocationLayer from '../map/location-layer';

const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

export default function MapCard({ parameters, isMobile, locationId, center }) {
  const [activeTab, setActiveTab] = useState({
    id: parameters[0].measurand || parameters[0],
    name: parameters[0].measurand || parameters[0],
  });

  return (
    <Card
      gridColumn={'5  / 13'}
      renderHeader={() => (
        <CardHeader className="card__header">
          <TabbedSelector
            tabs={parameters.map(x => ({
              id: x.measurand || x,
              name: x.measurand || x,
            }))}
            activeTab={activeTab}
            onTabSelect={t => {
              setActiveTab(t);
            }}
          />

          <CardTitle>Total Count of Measurements</CardTitle>
        </CardHeader>
      )}
      renderBody={() => (
        <Map center={center}>
          {(isMobile || locationId) && (
            <LocationsSource activeParameter={activeTab.name}>
              {isMobile ? (
                <MobileLayer />
              ) : (
                <LocationLayer
                  activeParameter={activeTab}
                  locationId={locationId}
                />
              )}
            </LocationsSource>
          )}
        </Map>
      )}
    />
  );
}

MapCard.propTypes = {
  locationId: T.number,
  isMobile: T.bool.isRequired,
  parameters: T.arrayOf(
    T.shape({
      measurand: T.string.isRequired,
    })
  ),
};
