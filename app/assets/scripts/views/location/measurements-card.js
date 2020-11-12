import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { formatThousands } from '../../utils/format';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import Card, { HighlightText, CardSubtitle } from '../../components/card';

const MeasurementsCont = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  grid-gap: 0.25rem;
`;
const Measurement = styled.div`
  width: min-content;
`;

export default function Measurements ({latestMeasurements, measurements, loc, parameters}) {
  const {fetched: lastMFetched, fetching: lastMFetching, error: lastMError, data: {results: lastMeasurements}} = latestMeasurements;
  const {fetched: mFetched, fetching: mFetching, error: mError, data} = measurements;

  const error = lastMError || mError;
  const fetched = lastMFetched || mFetched;
  const fetching = lastMFetching || mFetching;

  if (!fetched && !fetching) {
    return null;
  }

  let content = null;
  let intro = null;

  if (!fetched && !fetching) {
    return null;
  } else if (fetching) {
    return <LoadingMessage />;
  } else if (error) {
    return (
        <div className='fold__introduction prose prose--responsive'>
          <p>We couldn't get stats. Please try again later.</p>
          <p>If you think there's a problem, please <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
        </div>
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

      // Get latest measurements for this location in particular.
  let locLastMeasurement = _.find(lastMeasurements, {location: locData.location});
  console.log(locLastMeasurement.measurements)

  return (
    <Card
      title='Latest Measurements'
      gridColumn={'2 / 4'}
      gridRow={'1 / span 2'}
      renderBody={() => {
        return (
          <div className='card__body'>
            {locLastMeasurement ? (
              <MeasurementsCont>
                {locLastMeasurement.measurements.reduce((acc, o) => {
                  let param = _.find(parameters, {id: o.parameter});
                  return acc.concat([
                    <Measurement key={o.parameter}>
                      <CardSubtitle>{param.name}</CardSubtitle>
                      <HighlightText
                        className='card__highlight-text'
                        size='medium'>
                        {o.value}
                      </HighlightText>

                      <strong>{o.unit}</strong>
                      <p>{moment(o.lastUpdated).format('YYYY/MM/DD HH:mm')}</p>
                    </Measurement>
                  ]);
                }, [])}
              </MeasurementsCont>) : <p>N/A</p>}
          </div>
        );
      }}
      renderFooter={() => null}
    />
  );
}

Measurements.propTypes = {
  parameters: T.array,

  loc: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object
  }),

  latestMeasurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object
  }),

  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object
  })
};

