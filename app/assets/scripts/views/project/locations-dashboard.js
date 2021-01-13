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
  locationData,
  measurements,
  lifecycle,
  dateRange,
  selectedLocationDates,
  sources,
  locations,
  country,
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
    console.log('measurements', measurements);
    let query = {
      parameter: measurements,
      location: locations,
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
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            locationAverages: json.results,
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
  console.log('pre locationAverages', locationAverages);
  // console.log(
  //   'locationAverages',
  //   locationAverages &&
  //     locationAverages.reduce((prev, entry) => {
  //       const paramName = entry.parameter;
  //       const prevMatchingParam = prev[paramName];
  //       // paramName: {
  //       //   average: (calc(currAvg, entry.average)),
  //       //   displayName: entry.displayName,
  //       //   count: (calc(currCount + measurement_count)),
  //       //   parameter: entry.parameter,
  //       //   parameterId: entry.parameterId,
  //       //   unit: entry.unit,
  //       //   firstUpdated: entry.hour < [param].firstUpdated ? entry.hour : [param].firstUpdated,
  //       //   lastUpdated: entry.hour > [param].lastUpdated ? entry.hour : [param].lastUpdated,
  //       //   lastValue: entry.hour > [param].lastUpdated ? entry.average : [param].lastValue,
  //       // }
  //       const attempt = {
  //         ...prev,
  //         [paramName]: {
  //           displayName: entry.displayName,
  //           // count: prevMatchingParam.count ? prevMatchingParam.count + entry.measurement_count : entry.measurement_count,
  //           parameter: entry.parameter,
  //           parameterId: entry.parameterId,
  //           unit: entry.unit,
  //           //   firstUpdated: entry.hour < [param].firstUpdated ? entry.hour : [param].firstUpdated,
  //           //   lastUpdated: entry.hour > [param].lastUpdated ? entry.hour : [param].lastUpdated,
  //           //   lastValue: entry.hour > [param].lastUpdated ? entry.average : [param].lastValue,
  //         },
  //       };
  //       console.log('reducing', prevMatchingParam, attempt);
  //       return attempt;
  //     }, {})
  // );
  return (
    <div className="inner dashboard-cards">
      <DetailsCard
        measurements={measurements.length}
        lifecycle={lifecycle}
        date={selectedLocationDates}
      />
      {/* <LatestMeasurementsCard parameters={paramsToDisplay} /> */}
      <SourcesCard sources={sources} />
      {/* <TimeSeriesCard
        projectId={projectData.id}
        parameters={projectData.parameters}
        dateRange={dateRange}
        titleInfo={
          'The average value of a pollutant over time during the specified window at each individual node selected and the average values across all locations selected. While locations have varying time intervals over which they report, all time series charts show data at the same intervals. For one day or one month of data the hourly average is shown. For the project lifetime the daily averages are shown. If all locations are selected only the average across all locations is shown, not the individual location values.'
        }
      /> */}
      {/* <MeasureandsCard
        parameters={projectData.parameters} // TODO: pass averages
        titleInfo={
          "The average of all values and total number of measurements for the available pollutants during the chosen time window and for the selected locations. Keep in mind that not all locations may report the same pollutants. What are we doing when the locations aren't reporting the same pollutants?"
        }
      /> */}
      {/* <TemporalCoverageCard
        parameters={projectData.parameters} // TODO: pass averages
        dateRange={dateRange}
        spatial="project"
        id={projectData.name}
        titleInfo={
          'The average number of measurements for each pollutant by hour, day, or month at the selected locations. In some views a window may be turned off if that view is not applicable to the selected time window.'
        }
      /> */}
    </div>
  );
}

LocationsDashboard.propTypes = {
  locationData: T.object,
  lifecycle: T.array,
  dateRange: T.string,
};

export default LocationsDashboard;
