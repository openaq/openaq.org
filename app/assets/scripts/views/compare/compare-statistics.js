import React, { useMemo } from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import config from '../../config';
import InfoMessage from '../../components/info-message';
import {
  mean,
  median,
  mode,
  range,
  findLineByLeastSquares,
} from '../../utils/stats';

export default function CompareStatistics(props) {
  const { activeParam, compareLocations, compareMeasurements } = props;
  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const userNow = moment().format(dateFormat);
  const weekAgo = moment().subtract(30, 'days').format(dateFormat);

  const findPairs = (chartDataOrigin, chartDataReference) => {
    const pairs = {
      x: [], // origin sensor
      y: [], // reference sensor
    };

    chartDataReference.forEach(dataReference => {
      // chartDataReference.forEach(dataOrigin => {
      chartDataOrigin.forEach(dataOrigin => {
        // compare dates of each
        if (
          moment(dataReference.date.localNoTZ).isSame(
            moment(dataOrigin.date.localNoTZ)
          )
        ) {
          pairs.x.push(dataOrigin.value);
          pairs.y.push(dataReference.value);
        }
      });
    });
    return pairs;
  };
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

  const chartStats = useMemo(() => {
    const stats = {
      origin: {},
      reference: {},
      leastSquares: {},
    };
    if (chartData.length > 0) {
      stats['origin'].mean = mean(chartData[0].map(data => data.value)).toFixed(
        2
      );
      stats['origin'].mode = mode(chartData[0].map(data => data.value));
      stats['origin'].median = median(chartData[0].map(data => data.value));
      stats['origin'].range = range(chartData[0].map(data => data.value));
    }
    if (chartData.length > 1) {
      stats['reference'].mean = mean(
        chartData[1].map(data => data.value)
      ).toFixed(2);
      stats['reference'].mode = mode(chartData[1].map(data => data.value));
      stats['reference'].median = median(chartData[1].map(data => data.value));
      stats['reference'].range = range(chartData[1].map(data => data.value));
    }
    if (chartData.length > 1) {
      stats['pairs'] = findPairs(chartData[0], chartData[1]);
      stats['leastSquares'] = findLineByLeastSquares(
        stats['pairs'].x,
        stats['pairs'].y
      );
    }
    window.chartStats = stats;
    return stats;
  }, [chartData]);

  // Only show the "no results" message if measurements have loaded.
  const fetchedMeasurements = compareMeasurements.filter(
    o => o.fetched && !o.fetching
  );

  window.chartData = chartData;
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

    return (
      <div className="compare-statistics">
        {chartData.length > 0 && (
          <div style={{ width: '300px', float: 'left' }}>
            <h4>{compareLocations[0].data.name}:</h4>
            <p>Count: {chartData[0].length}</p>
            <p>Mean: {chartStats['origin'].mean}</p>
            <p>Median: {chartStats['origin'].median.toFixed(2)}</p>
            <p>Mode: {chartStats['origin'].mode[0]}</p>
            <p>
              Range: min: {chartStats['origin'].range[0]}, max:{' '}
              {chartStats['origin'].range[1]}
            </p>
          </div>
        )}
        {chartData.length > 1 && (
          <div style={{ width: '300px', float: 'left' }}>
            <h4>{compareLocations[1].data.name}:</h4>
            <p>Count: {chartData[1].length}</p>
            <p>Mean: {chartStats['reference'].mean}</p>
            <p>Median: {chartStats['reference'].median.toFixed(2)}</p>
            <p>Mode: {chartStats['reference'].mode[0]}</p>
            <p>
              Range: min: {chartStats['reference'].range[0]}, max:{' '}
              {chartStats['reference'].range[1]}
            </p>
          </div>
        )}
        {chartData.length > 1 && (
          <>
            {chartStats['leastSquares'] !== undefined && (
              <div>
                <h4>Line by least squares</h4>
                <p>
                  {chartStats['leastSquares'].m !== undefined && (
                    <>
                      y = {chartStats['leastSquares'].m.toFixed(3)} x +{' '}
                      {chartStats['leastSquares'].b.toFixed(3)}
                    </>
                  )}
                </p>
                <h4>Correlelation </h4>
                <p>
                  {chartStats['leastSquares'].r !== undefined && (
                    <>r = {chartStats['leastSquares'].r.toFixed(3)}</>
                  )}
                </p>
                <p>
                  {chartStats['leastSquares'].r2 !== undefined && (
                    <>r^2 = {chartStats['leastSquares'].r2.toFixed(3)}</>
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return <div>Error?</div>;
}

CompareStatistics.propTypes = {
  activeParam: T.object,
  compareMeasurements: T.array,
  compareLocations: T.array,
};
