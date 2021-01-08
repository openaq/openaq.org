import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import qs, { stringify as buildAPIQS } from 'qs';
import styled from 'styled-components';

import { buildQS } from '../../utils/url';
import config from '../../config';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import CardList from '../../components/card-list';
import DetailsCard from '../../components/dashboard/details-card';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';
import DatasetLocations from './map';
import DateSelector from '../../components/date-selector';
import Pill from '../../components/pill';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};
const defaultLocationData = {
  fetchedParams: false,
  fetchingParams: false,
  paramError: null,
  locationData: null,
};

const Dashboard = styled(CardList)`
  padding: 2rem 4rem;
`;

function Project({ match, history, location }) {
  const { id } = match.params;

  const [dateRange, setDateRange] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).dateRange
  );
  const [isAllLocations, toggleAllLocations] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [
    { fetchingParams, paramError, locationData },
    setSelectedLocationData,
  ] = useState(defaultLocationData);
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    query.dateRange = dateRange;
    history.push(`${location.pathname}?${buildQS(query)}`);
  }, [dateRange]);

  useEffect(() => {
    const fetchData = id => {
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
              data: json.results[0],
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

    fetchData(id);

    return () => {
      setState(defaultState);
    };
  }, []);

  const getLocations = () => {
    setSelectedLocationData(state => ({
      ...state,
      fetchingParams: true,
      paramError: null,
    }));

    let query = {
      location: selectedLocations,
      parameter: data.parameters[0].id,
    };
    let f = buildAPIQS(query, { arrayFormat: 'repeat' });
    console.log('request', `${config.api}/locations?${f}`);
    fetch(`${config.api}/locations?${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          setSelectedLocationData(state => ({
            ...state,
            fetchedParams: true,
            fetchingParams: false,
            locationData: {
              results: json.results,
              allParameters: json.results
                .map(location => location.parameters)
                .flat(),
            },
          }));
        },
        e => {
          console.log('e', e);
          setSelectedLocationData(state => ({
            ...state,
            fetchedParams: true,
            fetchingParams: false,
            paramError: e,
          }));
        }
      );
  };

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching || fetchingParams) {
    return <LoadingHeader />;
  }

  if (error || paramError || !data) {
    return <ErrorHeader />;
  }
  const paramsToDisplay = locationData
    ? locationData.allParameters
    : data.parameters;
  return (
    <section className="inpage">
      <Header
        tagline="Datasets"
        title={data.name}
        subtitle={data.subtitle}
        action={{
          api: `${config.apiDocs}`,
          download: () => {},
        }}
        sourceType={data.sourceType}
        isMobile={data.isMobile}
      />
      <div className="inpage__body">
        <DateSelector setDateRange={setDateRange} dateRange={dateRange} />
        {!isAllLocations && (
          <div
            className={'filters, inner'}
            style={{
              display: `grid`,
              gridTemplateRows: `1fr`,
              gridTemplateColumns: `repeat(2, 1fr)`,
            }}
          >
            <div>
              <Pill title={`${selectedLocations.length}/15`} />
            </div>
            <div style={{ display: `flex`, justifyContent: `flex-end` }}>
              <button className="nav__action-link" onClick={getLocations}>
                Apply Selection
              </button>
            </div>
          </div>
        )}
        <DatasetLocations
          country={data.countries[0]}
          locationIds={data.locationIds}
          parameters={[data.parameters[0]]}
          activeParameter={data.parameters[0].parameter}
          toggleAllLocations={toggleAllLocations}
          isAllLocations={isAllLocations}
          selectedLocations={selectedLocations}
          setSelectedLocations={setSelectedLocations}
        />
        <header
          className="fold__header inner"
          style={{ gridTemplateColumns: `1fr` }}
        >
          <h1 className="fold__title">Values for selected stations</h1>
        </header>
        <Dashboard
          gridTemplateRows={'repeat(4, 20rem)'}
          gridTemplateColumns={'repeat(12, 1fr)'}
          className="inner"
        >
          <DetailsCard
            measurements={data.measurements}
            date={{
              start: data.firstUpdated,
              end: data.lastUpdated,
            }}
            sources={data.sources}
          />
          <LatestMeasurementsCard parameters={paramsToDisplay} />
          <SourcesCard sources={data.sources} />
          <TimeSeriesCard
            projectId={data.id}
            parameters={paramsToDisplay}
            dateRange={dateRange}
            xUnit="day"
            titleInfo={
              'The average value of a pollutant over time during the specified window at each individual node selected and the average values across all locations selected. While locations have varying time intervals over which they report, all time series charts show data at the same intervals. For one day or one month of data the hourly average is shown. For the project lifetime the daily averages are shown. If all locations are selected only the average across all locations is shown, not the individual location values.'
            }
          />
          <MeasureandsCard
            parameters={paramsToDisplay}
            titleInfo={
              "The average of all values and total number of measurements for the available pollutants during the chosen time window and for the selected locations. Keep in mind that not all locations may report the same pollutants. What are we doing when the locations aren't reporting the same pollutants?"
            }
          />
          <TemporalCoverageCard
            parameters={paramsToDisplay}
            dateRange={dateRange}
            spatial="project"
            id={data.name}
            titleInfo={
              'The average number of measurements for each pollutant by hour, day, or month at the selected locations. In some views a window may be turned off if that view is not applicable to the selected time window.'
            }
          />
        </Dashboard>
      </div>
    </section>
  );
}

Project.propTypes = {
  match: T.object, // from react-router
  history: T.object,
  location: T.object,
};

export default Project;
