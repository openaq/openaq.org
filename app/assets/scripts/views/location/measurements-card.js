import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import LatestMeasurementsCard from '../../components/lastest-measurements-card';

const StyledLoading = styled(LoadingMessage)`
  grid-column: 4 / 11;
`;
const ErrorMessage = styled.div`
  grid-column: 4 / 11;
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

  const measurements = locLastMeasurement.measurements.reduce((acc, o) => {
    let param = _.find(parameters, { id: o.parameter });
    return acc.concat({
      measurand: param.name,
      last_value: o.value,
      unit: o.unit,
      lastUpdated: o.lastUpdated,
    });
  }, []);

  return <LatestMeasurementsCard measurements={measurements} />;
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
