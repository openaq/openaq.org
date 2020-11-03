import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { formatThousands } from '../../utils/format';

import LoadingMessage from '../../components/loading-message';

export default function StatsInfo ({latestMeasurements, measurements, loc, parameters}) {
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

  if (fetching) {
    content = <LoadingMessage />;
  } else if (error) {
    intro = (
        <div className='fold__introduction prose prose--responsive'>
          <p>We couldn't get stats. Please try again later.</p>
          <p>If you think there's a problem, please <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
        </div>
      );
  } else {
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

    content = (
        <div className='fold__body'>
          <div className='col-main'>
            <h2>Details</h2>
            <dl className='global-details-list'>
              <dt>Measurements</dt>
              <dd>{formatThousands(data.meta.totalMeasurements)}</dd>
              <dt>Collection Dates</dt>
              <dd>{sDate} - {eDate}</dd>
              <dt>Coordinates</dt>
              <dd>N{lat}, E{lng}</dd>
            </dl>
          </div>

          <div className='col-sec'>
            <h2>Latest measurements</h2>
            {locLastMeasurement ? (
              <dl className='global-details-list'>
                {locLastMeasurement.measurements.reduce((acc, o) => {
                  let param = _.find(parameters, {id: o.parameter});
                  return acc.concat([
                    <dt key={`dt-${o.parameter}`}>{param.name}</dt>,
                    <dd key={`dd-${o.parameter}`}>{o.value}{o.unit} at {moment(o.lastUpdated).format('YYYY/MM/DD HH:mm')}</dd>
                  ]);
                }, [])}
              </dl>
            ) : <p>N/A</p>}
          </div>
        </div>
      );
  }

  return (
      <section className='fold' id='location-fold-stats'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Stats</h1>
            {intro}
          </header>
          {content}
        </div>
      </section>
  );
}

StatsInfo.propTypes = {
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

