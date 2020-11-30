import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import Card, { HighlightText, CardSubtitle } from '../card';
import { formatThousands } from '../../utils/format';

export default function DetailsCard({ measurements, date, coords }) {
  const startDate = date ? moment(date.start).format('YYYY/MM/DD') : null;
  const endDate = date ? moment(date.end).format('YYYY/MM/DD') : null;

  return (
    <Card
      title="Details"
      gridColumn={'1 / 4'}
      renderBody={() => {
        return (
          <>
            <HighlightText className="card__highlight-text" size={'large'}>
              {formatThousands(measurements)}
            </HighlightText>
            <CardSubtitle className="card__subtitle">Measurements</CardSubtitle>
          </>
        );
      }}
      renderFooter={() => {
        return (
          <dl className="global-details-list">
            {coords && (
              <>
                <dt>Coordinates</dt>
                <dd>
                  N{coords.lat}, E{coords.lng}
                </dd>
              </>
            )}
            {date && (
              <>
                <dt>Collection Dates</dt>
                <dd>
                  {startDate} - {endDate}
                </dd>
              </>
            )}
          </dl>
        );
      }}
    />
  );
}

DetailsCard.propTypes = {
  measurements: T.number.isRequired,
  date: T.shape({
    start: T.string.isRequired,
    end: T.string.isRequired,
  }),
  coords: T.shape({
    lat: T.number.isRequired,
    lng: T.number.isRequired,
  }),
};
