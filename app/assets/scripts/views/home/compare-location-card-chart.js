import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';

import ChartMeasurement from '../../components/chart-measurement';

export default function CompareLocationCardChart(props) {
  const { measurement } = props;

  // All the times are local and shouldn't be converted to UTC.
  // The values should be compared at the same time local to ensure an
  // accurate comparison.
  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const userNow = moment().format(dateFormat);
  const weekAgo = moment().subtract(21, 'days').format(dateFormat);

  // Prepare data.
  const chartData = useMemo(
    () =>
      measurement.data.results
        .filter(res => {
          if (res.average < 0) return false;
          const measurementDate = moment(res.hour).format(dateFormat);
          return measurementDate >= weekAgo && measurementDate <= userNow;
        })
        .map(o => {
          // Map data according to chart needs.
          return {
            value: o.average,
            date: {
              localNoTZ: new Date(o.hour),
            },
          };
        }),
    [measurement]
  );

  const yMax = d3.max(chartData, o => o.value) || 0;

  // 1 Week.
  const xRange = [moment().subtract(21, 'days').toDate(), moment().toDate()];

  if (!chartData.length) return null;

  return (
    <ChartMeasurement
      className="home-compare-chart"
      data={[chartData]}
      xRange={xRange}
      yRange={[0, yMax]}
      yLabel={measurement.data.results[0].unit}
      compressed
    />
  );
}

CompareLocationCardChart.propTypes = {
  measurement: PropTypes.object,
};
