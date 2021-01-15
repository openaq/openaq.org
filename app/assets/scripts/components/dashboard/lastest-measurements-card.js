import React from 'react';
import { PropTypes as T } from 'prop-types';

import styled from 'styled-components';
import moment from 'moment';

import Card, { HighlightText, CardSubtitle } from '../card';
import { round, formatParameterByUnit, renderUnit } from '../../utils/format';

const Container = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  grid-gap: 1rem;
  list-style: none;
  padding: 0;
`;

export default function LatestMeasurementsCard({ parameters }) {
  return (
    <Card
      title="Latest Measurements"
      id="latest"
      className="card--latest"
      renderBody={() => {
        return (
          <Container>
            {parameters.map(o => (
              <li key={o.parameter}>
                <CardSubtitle className="card__subtitle">
                  {o.displayName}
                </CardSubtitle>
                <HighlightText className="card__highlight-text" size="medium">
                  {round(
                    formatParameterByUnit(
                      o.lastValue,
                      o.unit,
                      renderUnit(o.unit)
                    ),
                    2
                  )}
                </HighlightText>
                <strong>{renderUnit(o.unit)}</strong>
                <p>{moment(o.lastUpdated).format('YYYY/MM/DD HH:mm')}</p>
              </li>
            ))}
          </Container>
        );
      }}
      renderFooter={() => null}
    />
  );
}

LatestMeasurementsCard.propTypes = {
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
      lastValue: T.number.isRequired,
      unit: T.string.isRequired,
      lastUpdated: T.string.isRequired,
    })
  ),
};
