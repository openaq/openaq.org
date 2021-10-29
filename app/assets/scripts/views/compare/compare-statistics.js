import React, { useMemo, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';

import c from 'classnames';
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

  const [correlationSensors, setCorrelationSensors] = useState([0, 1]);

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

  const formatFloats = n => {
    return isNaN(n) ? 'n/a' : parseFloat(n).toFixed(2);
  };

  const chartStats = useMemo(() => {
    const stats = {
      data: {},
      leastSquares: {},
    };

    for (let i = 0; i < chartData.length; i++) {
      stats.data[i] = {
        mean: mean(chartData[i].map(data => data.value)),
        mode: mode(chartData[i].map(data => data.value)),
        median: median(chartData[i].map(data => data.value)),
        range: range(chartData[i].map(data => data.value)),
      };
    }

    if (chartData.length > 1) {
      stats['pairs'] = findPairs(
        chartData[correlationSensors[0] % chartData.length],
        chartData[correlationSensors[1] % chartData.length]
      );
      stats['leastSquares'] = findLineByLeastSquares(
        stats['pairs'].x,
        stats['pairs'].y
      );
    }
    window.chartStats = stats;
    return stats;
  }, [chartData, correlationSensors]);

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
    const kl = [
      'compare-marker--st',
      'compare-marker--nd',
      'compare-marker--rd',
    ];

    return (
      <div className="compare-statistics">
        {chartData.map((data, index) => {
          return (
            <div className={'compare-statistics-block'} key={index}>
              <h3 className="compare-statistics-location">
                {compareLocations[index].data !== undefined && 
                  <Link
                    to={`/location/${encodeURIComponent(
                      compareLocations[index].data.id
                    )}`}
                  >
                    <span className={c('compare-marker', kl[index])}>
                      Sensor #{index + 1}
                    </span>{' '}
                  </Link>
                }
              </h3>
              <p>{compareLocations[index].data.name}</p>
              <p className="compare-sensor-type">
                Sensor Type: {compareLocations[index].data.sensorType}
              </p>
              <p>Count: {data.length}</p>
              {data.length > 0 && (
                <div>
                  <p>Mean: {formatFloats(chartStats.data[index].mean)}</p>
                  <p>Median: {formatFloats(chartStats.data[index].median)}</p>
                  <p>Mode: {formatFloats(chartStats.data[index].mode[0])}</p>
                  <p>
                    Range: min: {formatFloats(chartStats.data[index].range[0])},
                    max: {formatFloats(chartStats.data[index].range[1])}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        {chartData.length > 1 && (
          <div className={'compare-statistics-block'}>
            {chartStats['leastSquares'] !== undefined && (
              <div className="compare-correlation">
                <h3>Correlation</h3>
                {chartData.length > 2 ? (
                  <p>
                    Sensor #{(correlationSensors[0] % chartData.length) + 1}{' '}
                    <a
                      onClick={() => {
                        setCorrelationSensors([
                          (correlationSensors[0] % chartData.length) + 1,
                          correlationSensors[1],
                        ]);
                      }}
                    >
                      [change]
                    </a>{' '}
                    and
                    <br />
                    Sensor #{(correlationSensors[1] % chartData.length) +
                      1}{' '}
                    <a
                      onClick={() => {
                        setCorrelationSensors([
                          correlationSensors[0],
                          (correlationSensors[1] + 1) % chartData.length,
                        ]);
                      }}
                    >
                      [change]
                    </a>
                  </p>
                ) : (
                  <p>
                    Sensor #{(correlationSensors[0] % chartData.length) + 1} and
                    Sensor #{(correlationSensors[1] % chartData.length) + 1}{' '}
                  </p>
                )}
                <strong>
                  <p>Line by least squares</p>
                </strong>
                <p>
                  {chartStats['leastSquares'].m !== undefined ? (
                    <>
                      y = {formatFloats(chartStats['leastSquares'].m)} x +{' '}
                      {formatFloats(chartStats['leastSquares'].b)}
                    </>
                  ) : (
                    'n/a'
                  )}
                </p>
                <strong>
                  <p>Correlation factor</p>
                </strong>
                <p>
                  {chartStats['leastSquares'].r !== undefined ? (
                    <>r = {formatFloats(chartStats['leastSquares'].r)}</>
                  ) : (
                    'n/a'
                  )}
                </p>
                <p>
                  {chartStats['leastSquares'].r2 !== undefined ? (
                    <>r^2 = {formatFloats(chartStats['leastSquares'].r2)}</>
                  ) : (
                    'n/a'
                  )}
                </p>
              </div>
            )}
          </div>
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
