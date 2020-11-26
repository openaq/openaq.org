import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

import Card, { HighlightText, CardSubtitle } from './card';
import { formatThousands } from '../utils/format';

export default function InfoCard({ measurements, date, coords }) {
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
            {date && (
              <>
                <dt>Collection Dates</dt>
                <dd>
                  {startDate} - {endDate}
                </dd>
              </>
            )}
            {coords && (
              <>
                <dt>Coordinates</dt>
                <dd>
                  N{coords.lat}, E{coords.lng}
                </dd>
              </>
            )}
          </dl>
        );
      }}
    />
  );
}

InfoCard.propTypes = {
  measurements: T.number.isRequired,
  date: T.shape({
    start: T.instanceOf(Date).isRequired,
    end: T.instanceOf(Date).isRequired,
  }),
  coords: T.shape({
    lat: T.number.isRequired,
    lng: T.number.isRequired,
  }),
};
