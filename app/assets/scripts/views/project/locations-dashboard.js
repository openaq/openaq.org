import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import qs, { stringify as buildAPIQS } from 'qs';
import styled from 'styled-components';

import { buildQS } from '../../utils/url';
import config from '../../config';
import { getCountryBbox } from '../../utils/countries';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import CardList from '../../components/card-list';
import DetailsCard from '../../components/dashboard/details-card';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';

const Dashboard = styled(CardList)`
  padding: 2rem 4rem;
`;

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

function LocationsDashboard({ locationData, lifecycle, dateRange }) {
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    if (isAllLocations) {
      fetchLocationAverages();
    }

    return () => {
      setState(defaultState);
    };
  }, []);

  const fetchLocationAverages = id => {
    setState(state => ({ ...state, fetching: true, error: null }));
    fetch(`${config.api}/projects/${encodeURIComponent(id)}`)
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
            projectData: json.results[0],
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
  return (
    <Dashboard
      gridTemplateRows={'repeat(4, 20rem)'}
      gridTemplateColumns={'repeat(12, 1fr)'}
      className="inner"
    >
      <DetailsCard
        measurements={projectData.measurements}
        lifecycle={lifecycle}
        date={{
          start: projectData.firstUpdated,
          end: projectData.lastUpdated,
        }}
      />
      {/* <LatestMeasurementsCard parameters={paramsToDisplay} /> */}
      <SourcesCard sources={projectData.sources} />
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
    </Dashboard>
  );
}

LocationsDashboard.propTypes = {
  locationData: T.object,
  lifecycle: T.array,
  dateRange: T.string,
};

export default LocationsDashboard;
