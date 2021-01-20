import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { stringify as buildAPIQS } from 'qs';

import config from '../../config';

import LoadingMessage from '../../components/loading-message';
import ErrorMessage from '../../components/error-message';
import Dashboard from './dashboard';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  parameters: null,
  averages: null,
};

function NodesDashboard({
  bbox,
  isMobile,
  measurements,
  projectId,
  projectName,
  selectedParams,
  lifecycle,
  dateRange,
  projectDates,
  sources,
  locations,
  country,
}) {
  const [
    { fetched, fetching, error, parameters, averages },
    setState,
  ] = useState(defaultState);

  const [year, month, day] = (dateRange ? dateRange.split('/') : []).map(
    Number
  );

  useEffect(() => {
    fetchLocationAverages();

    return () => {
      setState(defaultState);
    };
  }, [selectedParams, locations]);

  const fetchLocationAverages = () => {
    setState(state => ({ ...state, fetching: true, error: null }));
    let query = {
      parameter: [...new Set(selectedParams)],
      location: [...new Set(locations)],
      ...(dateRange
        ? {
            // In user space, month is 1 indexed
            date_from: new Date(year, month - 1, day || 1),
            date_to: day
              ? new Date(year, month - 1, day + 1)
              : new Date(year, month, 0),
          }
        : {}),
      spatial: 'location',
      temporal: 'day',
      group: true,
    };

    if (country) {
      query.country_id = country;
    }

    let f = buildAPIQS(query, { arrayFormat: 'repeat' });

    fetch(`${config.api}/averages?${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          const aggregatedLocationAvgs = json.results.reduce((prev, entry) => {
            const paramName = entry.parameter;
            const prevMatchingParam = { ...prev[paramName] };
            return {
              ...prev,
              [paramName]: {
                displayName: entry.displayName,
                averageSum:
                  prevMatchingParam?.averageSum + entry.average ||
                  entry.average,
                totalEntries: prevMatchingParam?.totalEntries + 1 || 1,
                count:
                  prevMatchingParam?.count + entry.measurement_count ||
                  entry.measurement_count,
                parameter: entry.parameter,
                parameterId: entry.parameterId,
                unit: entry.unit,
                firstUpdated:
                  new Date(entry.day) < new Date(prevMatchingParam.firstUpdated)
                    ? entry.day
                    : prevMatchingParam.firstUpdated || entry.day,
                lastUpdated:
                  new Date(entry.day) > new Date(prevMatchingParam.lastUpdated)
                    ? entry.day
                    : prevMatchingParam.lastUpdated || entry.day,
                lastValue:
                  new Date(entry.day) > new Date(prevMatchingParam.lastUpdated)
                    ? entry.average
                    : prevMatchingParam.lastValue || entry.average,
              },
            };
          }, {});
          const calculatedParams = Object.values(aggregatedLocationAvgs)
            .flat()
            .map(param => {
              param.average = param.averageSum / param.totalEntries;
              return param;
            });
          const groupedAverges = json.results.reduce((prev, entry) => {
            const paramName = entry.parameter;
            return {
              ...prev,
              [paramName]: [...(prev[paramName] || []), entry],
            };
          }, {});
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            parameters: calculatedParams,
            averages: groupedAverges,
          }));
        },
        e => {
          console.log('e', e);
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            error: e,
          }));
        }
      );
  };

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingMessage />;
  }

  if (error || !parameters.length) {
    return (
      <ErrorMessage
        isShowingDiagnosis={false}
        instructions="Please try a different location or parameter"
      />
    );
  }

  return (
    <Dashboard
      bbox={bbox}
      isMobile={isMobile}
      measurements={measurements}
      projectParams={parameters}
      projectId={projectId}
      projectName={projectName}
      lifecycle={lifecycle}
      dateRange={dateRange}
      projectDates={projectDates}
      sources={sources}
      timeseriesAverages={averages}
    />
  );
}

NodesDashboard.propTypes = {
  bbox: PropTypes.array,
  isMobile: PropTypes.bool,
  measurements: PropTypes.number,
  projectName: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedParams: PropTypes.array,
  lifecycle: PropTypes.arrayOf(PropTypes.number),
  dateRange: PropTypes.string,
  projectDates: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      sourceURL: PropTypes.string,
      url: PropTypes.string,
      contacts: PropTypes.array,
    })
  ),
  locations: PropTypes.arrayOf(PropTypes.number),
  country: PropTypes.string,
};

export default NodesDashboard;
