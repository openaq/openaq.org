import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import LoadingMessage from '../../components/loading-message';
import MeasureandsCard from '../../components/measurands-card';

const StyledLoading = styled(LoadingMessage)`
  grid-column: 1 / 7;
`;
const ErrorMessage = styled.div`
  grid-column: 1 / 7;
`;

export default function Averages({ measurements }) {
  const { fetched, fetching, error, data } = measurements;

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

  return <MeasureandsCard measurements={data.results} />;
}
Averages.propTypes = {
  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
