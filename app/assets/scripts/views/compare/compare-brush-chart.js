import React, { useMemo } from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import * as d3 from 'd3';

import config from '../../config';
import InfoMessage from '../../components/info-message';
import ChartBrush from '../../components/chart-brush';

export default function CompareBrushChart(props) {
  const { activeParam, compareLocations, compareMeasurements } = props;

  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const userNow = moment().format(dateFormat);
  const weekAgo = moment().subtract(7, 'days').format(dateFormat);

  // Prepare data.
  const chartData = useMemo(() => {
    return _(compareMeasurements)
      .map((o, locIdx) => {
        if (o.fetched && !o.fetching && o.data) {
          return o.data.results
            .filter(res => {
              // The result parameter has to be on the location reported
              // parameter list and has to be the same as the active one.
              const locParamList = compareLocations[locIdx].data.parameters;
              const resParamInList = locParamList.find(
                p => p.parameterId === res.parameterId
              );
              if (!resParamInList || res.parameterId !== activeParam.id) {
                return false;
              }

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
            });
        } else {
          return null;
        }
      })
      .filter(Boolean)
      .value();
  }, [activeParam.name, compareMeasurements, compareLocations]);

  const yMax = d3.max(chartData || [], r => d3.max(r, o => o.value)) || 0;

  // 1 Week.
  // 3 weeks
  const xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

  // Only show the "no results" message if measurements have loaded.
  const fetchedMeasurements = compareMeasurements.filter(
    o => o.fetched && !o.fetching
  );
  if (fetchedMeasurements.length) {
    const dataCount = chartData.reduce((prev, curr) => prev + curr.length, 0);

    if (!dataCount) {
      return (
        <InfoMessage>
          <p>There are no data for the selected parameter.</p>
          <p>
            Maybe you&apos;d like to suggest a{' '}
            <a href={config.newSourceUrl} title="Suggest a new source">
              new source
            </a>
            .
          </p>
        </InfoMessage>
      );
    }
  }

  return (
    <ChartBrush
      className="brush-chart"
      data={chartData}
      xRange={xRange}
      yRange={[0, yMax]}
      yLabel={activeParam.preferredUnit}
    />
  );
}

CompareBrushChart.propTypes = {
  activeParam: T.object,
  compareMeasurements: T.array,
  compareLocations: T.array,
};
