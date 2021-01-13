import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import qs, { stringify as buildAPIQS } from 'qs';

import { buildQS } from '../../utils/url';
import config from '../../config';
import { getCountryBbox } from '../../utils/countries';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import DetailsCard from '../../components/dashboard/details-card';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  locationAverages: null,
};

function LocationsDashboard({
  measurements,
  selectedParams,
  lifecycle,
  dateRange,
  selectedLocationDates,
  sources,
  locations,
  country,
  name,
}) {
  const [{ fetched, fetching, error, locationAverages }, setState] = useState(
    defaultState
  );

  const [year, month, day] = (dateRange ? dateRange.split('/') : []).map(
    Number
  );

  useEffect(() => {
    fetchLocationAverages();

    return () => {
      setState(defaultState);
    };
  }, []);

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
      country_id: country,
    };

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
                //   firstUpdated: entry.hour < [param].firstUpdated ? entry.hour : [param].firstUpdated,
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
          const calculatedAvg = Object.values(aggregatedLocationAvgs)
            .flat()
            .map(param => {
              param.average = param.averageSum / param.totalEntries;
              return param;
            });
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            locationAverages: calculatedAvg,
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
    return <LoadingHeader />;
  }

  if (error || !locationAverages) {
    return <ErrorHeader />;
  }

  return (
    <div className="inner dashboard-cards">
      <DetailsCard
        measurements={measurements}
        lifecycle={lifecycle}
        date={selectedLocationDates}
      />
      <LatestMeasurementsCard parameters={locationAverages} />
      <SourcesCard sources={sources} />
      {/* <TimeSeriesCard
        projectId={projectData.id}
        parameters={projectData.parameters}
        dateRange={dateRange}
        titleInfo={
          'The average value of a pollutant over time during the specified window at each individual node selected and the average values across all locations selected. While locations have varying time intervals over which they report, all time series charts show data at the same intervals. For one day or one month of data the hourly average is shown. For the project lifetime the daily averages are shown. If all locations are selected only the average across all locations is shown, not the individual location values.'
        }
      /> */}
      <MeasureandsCard
        parameters={locationAverages}
        titleInfo={
          "The average of all values and total number of measurements for the available pollutants during the chosen time window and for the selected locations. Keep in mind that not all locations may report the same pollutants. What are we doing when the locations aren't reporting the same pollutants?"
        }
      />
      <TemporalCoverageCard
        parameters={locationAverages}
        dateRange={dateRange}
        spatial="project"
        id={name}
        titleInfo={
          'The average number of measurements for each pollutant by hour, day, or month at the selected locations. In some views a window may be turned off if that view is not applicable to the selected time window.'
        }
      />
    </div>
  );
}

LocationsDashboard.propTypes = {
  locationData: T.object,
  lifecycle: T.array,
  dateRange: T.string,
};

export default LocationsDashboard;
