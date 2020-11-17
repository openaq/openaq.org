import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import Card, { HighlightText, CardSubtitle } from '../../components/card';

const StyledLoading = styled(LoadingMessage)`
  grid-column: 4 / 11;
`;
const ErrorMessage = styled.div`
  grid-column: 4 / 11;
`;

const MeasurementsCont = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  grid-gap: 0.25rem;
`;
const Measurement = styled.div`
  width: min-content;
`;

export default function Measurements({
  latestMeasurements,
  location,
  parameters,
}) {
  const {
    fetched: lastMFetched,
    fetching: lastMFetching,
    error: lastMError,
    data: { results: lastMeasurements },
  } = latestMeasurements;

  const error = lastMError;
  const fetched = lastMFetched;
  const fetching = lastMFetching;

  if (!fetched && !fetching) {
    return null;
  } else if (fetching) {
    return <StyledLoading />;
  } else if (error) {
    return (
      <ErrorMessage className="fold__introduction prose prose--responsive">
        <p>{"We couldn't get stats. Please try again later."}</p>
        <p>
          {"If you think there's a problem, please "}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            contact us.
          </a>
        </p>
      </ErrorMessage>
    );
  }

  // Get latest measurements for this location in particular.
  let locLastMeasurement = _.find(lastMeasurements, {
    location: location,
  });
  // FIXME The current api is returning results with duplicate values.
  locLastMeasurement.measurements = _.uniqWith(
    locLastMeasurement.measurements,
    _.isEqual
  );

  return (
    <Card
      title="Latest Measurements"
      gridColumn={'4 / 11'}
      renderBody={() => {
        return (
          <div className="card__body">
            {locLastMeasurement ? (
              <MeasurementsCont>
                {locLastMeasurement.measurements.reduce((acc, o) => {
                  let param = _.find(parameters, { id: o.parameter });
                  return acc.concat([
                    <Measurement key={o.parameter}>
                      <CardSubtitle>{param.name}</CardSubtitle>
                      <HighlightText
                        className="card__highlight-text"
                        size="medium"
                      >
                        {o.value}
                      </HighlightText>

                      <strong>{o.unit}</strong>
                      <p>{moment(o.lastUpdated).format('YYYY/MM/DD HH:mm')}</p>
                    </Measurement>,
                  ]);
                }, [])}
              </MeasurementsCont>
            ) : (
              <p>N/A</p>
            )}
          </div>
        );
      }}
      renderFooter={() => null}
    />
  );
}

Measurements.propTypes = {
  parameters: T.array,
  location: T.string,
  latestMeasurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
