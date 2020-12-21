import React from 'react';
import { PropTypes as T } from 'prop-types';

import styled from 'styled-components';
import moment from 'moment';

import Card, { HighlightText, CardSubtitle } from '../card';
import { round } from '../../utils/format';

const Container = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  grid-gap: 0.25rem;
`;

const Measurement = styled.div`
  width: min-content;
`;

export default function LatestMeasurementsCard({ parameters }) {
  return (
    <Card
      title="Latest Measurements"
      gridColumn={'4 / 11'}
      renderBody={() => {
        return (
          <Container>
            {parameters.map(o => (
              <Measurement key={o.parameter}>
                <CardSubtitle className="card__subtitle">
                  {o.parameter}
                </CardSubtitle>
                <HighlightText className="card__highlight-text" size="medium">
                  {round(o.lastValue, 1)}
                </HighlightText>

                <strong>{o.unit}</strong>
                <p>{moment(o.lastUpdated).format('YYYY/MM/DD HH:mm')}</p>
              </Measurement>
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
