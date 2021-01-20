import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Card, { CardHeader as BaseHeader, CardTitle } from '../card';
import Map from '../map';
import MobileSource from '../map/mobile-source';
import MobileBoundsLayer from '../map/mobile-bounds-layer';
import MobilePointsLayer from '../map/mobile-points-layer';

const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

export default function MobileDataLocationsCard({
  locationId,
  bbox,
  firstUpdated,
  lastUpdated,
}) {
  return (
    <Card
      renderHeader={() => (
        <CardHeader className="card__header">
          <CardTitle className="card__title">Mobile data locations</CardTitle>
        </CardHeader>
      )}
      renderBody={() => (
        <Map bbox={bbox}>
          <MobileSource
            locationId={locationId}
            firstUpdated={firstUpdated}
            lastUpdated={lastUpdated}
          >
            <MobileBoundsLayer locationId={locationId} />
            <MobilePointsLayer locationId={locationId} />
          </MobileSource>
        </Map>
      )}
    />
  );
}

MobileDataLocationsCard.propTypes = {
  locationId: PropTypes.number.isRequired,
  bbox: PropTypes.arrayOf(PropTypes.number).isRequired,
  firstUpdated: PropTypes.string.isRequired,
  lastUpdated: PropTypes.string.isRequired,
};
