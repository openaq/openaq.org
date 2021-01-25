import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Card, { CardHeader as BaseHeader, CardTitle } from '../card';
import ErrorMessage from '../error-message';
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
  locationIds,
  bbox,
  dateRange,
}) {
  return (
    <Card
      renderHeader={() => (
        <CardHeader className="card__header">
          <CardTitle className="card__title">Mobile data locations</CardTitle>
        </CardHeader>
      )}
      renderBody={() => {
        if (locationIds?.length > 15) {
          return (
            <ErrorMessage
              isShowingDiagnosis={false}
              instructions={
                "Can't show detailed mobile data for more than 15 locations"
              }
            />
          );
        }
        return (
          <Map bbox={bbox}>
            <MobileSource>
              <MobileBoundsLayer
                locationId={locationId}
                locationIds={locationIds}
              />
              <MobilePointsLayer
                locationId={locationId}
                locationIds={locationIds}
                dateRange={dateRange}
              />
            </MobileSource>
          </Map>
        );
      }}
    />
  );
}

MobileDataLocationsCard.propTypes = {
  locationId: PropTypes.number,
  locationIds: PropTypes.arrayOf(PropTypes.number),
  bbox: PropTypes.arrayOf(PropTypes.number).isRequired,
  dateRange: PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
  }),
};
