import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import { formatThousands } from '../../utils/format';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import Card, { HighlightText, CardSubtitle } from '../../components/card';

const ErrorMessage = styled.div`
  grid-column: 1 / 4;
`;

const StyledLoading = styled(LoadingMessage)`
  grid-column: 1 / 4;
`;

export default function StatsInfo({ latestMeasurements, measurements, loc }) {
  const {
    fetched: lastMFetched,
    fetching: lastMFetching,
    error: lastMError,
  } = latestMeasurements;
  const {
    fetched: mFetched,
    fetching: mFetching,
    error: mError,
    data,
  } = measurements;

  const error = lastMError || mError;
  const fetched = lastMFetched || mFetched;
  const fetching = lastMFetching || mFetching;

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

  let sDate = moment(locData.firstUpdated).format('YYYY/MM/DD');
  let eDate = moment(locData.lastUpdated).format('YYYY/MM/DD');

  let lng = ' --';
  let lat = ' --';
  if (locData.coordinates) {
    lng = Math.floor(locData.coordinates.longitude * 1000) / 1000;
    lat = Math.floor(locData.coordinates.latitude * 1000) / 1000;
  }

  return (
    <Card
      title="Details"
      gridColumn={'1 / 4'}
      renderBody={() => {
        return (
          <div className="card__body">
            <HighlightText className="card__highlight-text" size={'large'}>
              {formatThousands(data.meta.totalMeasurements)}
            </HighlightText>
            <CardSubtitle className="card__subtitle">Measurements</CardSubtitle>
          </div>
        );
      }}
      renderFooter={() => {
        return (
          <div className="card__footer">
            <dl className="global-details-list">
              <dt>Collection Dates</dt>
              <dd>
                {sDate} - {eDate}
              </dd>
              <dt>Coordinates</dt>
              <dd>
                N{lat}, E{lng}
              </dd>
            </dl>
          </div>
        );
      }}
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

  latestMeasurements: T.shape({
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
