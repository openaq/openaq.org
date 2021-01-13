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

export default function MapCard({ locationId, bbox, dateRange }) {
  return (
    <Card
      gridColumn={'1 / -1'}
      renderHeader={() => (
        <CardHeader className="card__header">
          <CardTitle>Mobile data locations</CardTitle>
        </CardHeader>
      )}
      renderBody={() => (
        <Map bbox={bbox}>
          <MobileSource dateRange={dateRange}>
            <MobileBoundsLayer locationId={locationId} />
            <MobilePointsLayer locationId={locationId} />
          </MobileSource>
        </Map>
      )}
    />
  );
}

MapCard.propTypes = {
  locationId: PropTypes.number.isRequired,
  bbox: PropTypes.arrayOf(PropTypes.number).isRequired,
  dateRange: PropTypes.string.isRequired,
};
