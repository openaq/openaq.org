import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import * as d3 from 'd3';

import InfoMessage from '../../components/info-message';
import ChartMeasurement from '../../components/chart-measurement';

export default function MeasurementsChart({ measurements, activeParam }) {
  let results = measurements.data.results;
  // All the times are local and shouldn't be converted to UTC.
  // The values should be compared at the same time local to ensure an
  // accurate comparison.
  let userNow = moment().format('YYYY/MM/DD HH:mm:ss');
  let weekAgo = moment().subtract(7, 'days').format('YYYY/MM/DD HH:mm:ss');

  const filterFn = o => {
    if (o.parameter !== activeParam.id) {
      return false;
    }
    if (o.value < 0) return false;
    let localDate = moment
      .parseZone(o.date.local)
      .format('YYYY/MM/DD HH:mm:ss');
    return localDate >= weekAgo && localDate <= userNow;
  };

  // Prepare data.
  let chartData = _.cloneDeep(results)
    .filter(filterFn)
    .map(o => {
      // Disregard timezone on local date.
      let dt = o.date.local.match(
        /^[0-9]{4}(?:-[0-9]{2}){2}T[0-9]{2}(?::[0-9]{2}){2}/
      )[0];
      // `measurement` local date converted directly to user local.
      // We have to use moment instead of new Date() because the behavior
      // is not consistent across browsers.
      // Firefox interprets the string as being in the current timezone
      // while chrome interprets it as being utc. So:
      // Date: 2016-08-25T14:00:00
      // Firefox result: Thu Aug 25 2016 14:00:00 GMT-0400 (EDT)
      // Chrome result: Thu Aug 25 2016 10:00:00 GMT-0400 (EDT)
      o.date.localNoTZ = moment(dt).toDate();
      return o;
    });

  let yMax = d3.max(chartData, o => o.value) || 0;

  // 1 Week.
  let xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

  if (!chartData.length) {
    return (
      <InfoMessage>
        <p>There are no data for the selected parameter.</p>
        <p>
          Maybe you&apos;d like to suggest a{' '}
          <a
            href="https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform"
            title="Suggest a new source"
          >
            new source
          </a>
          .
        </p>
      </InfoMessage>
    );
  }

  return (
    <ChartMeasurement
      className="location-measurement-chart"
      data={[chartData]}
      xRange={xRange}
      yRange={[0, yMax]}
      yLabel={activeParam.preferredUnit}
    />
  );
}

MeasurementsChart.propTypes = {
  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),

  activeParam: T.object,
};
