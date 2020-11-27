import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import DetailsCard from '../../components/dashboard/details-card';

const ErrorMessage = styled.div`
  grid-column: 1 / 4;
`;

const StyledLoading = styled(LoadingMessage)`
  grid-column: 1 / 4;
`;

export default function StatsInfo({ measurements, loc }) {
  const {
    fetched: mFetched,
    fetching: mFetching,
    error: mError,
    data,
  } = measurements;

  const error = mError;
  const fetched = mFetched;
  const fetching = mFetching;

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

  let locData = loc.data;

  let lng = ' --';
  let lat = ' --';
  if (locData.coordinates) {
    lng = Math.floor(locData.coordinates.longitude * 1000) / 1000;
    lat = Math.floor(locData.coordinates.latitude * 1000) / 1000;
  }

  return (
    <DetailsCard
      measurements={data.meta.totalMeasurements}
      date={{ start: locData.firstUpdated, end: locData.lastUpdated }}
      coords={{ lat, lng }}
    />
  );
}

StatsInfo.propTypes = {
  parameters: T.array,

  loc: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),

  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
