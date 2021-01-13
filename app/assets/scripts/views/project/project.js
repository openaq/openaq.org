import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import qs, { stringify as buildAPIQS } from 'qs';
import styled from 'styled-components';

import { buildQS } from '../../utils/url';
import config from '../../config';
import { getCountryBbox } from '../../utils/countries';
import { parameterMax } from '../../utils/map-settings';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import CardList from '../../components/card-list';
import DetailsCard from '../../components/dashboard/details-card';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';
import DatasetLocations from './dataset-locations';
import DateSelector from '../../components/date-selector';
import Pill from '../../components/pill';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  projectData: null,
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
  const [selectedLocations, setSelectedLocations] = useState({});
  const [
    { fetched, fetching, error, projectData, locationData },
    setState,
  ] = useState(defaultState);

  useEffect(() => {
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    query.dateRange = dateRange;
    history.push(`${location.pathname}?${buildQS(query)}`);
  }, [dateRange]);

  useEffect(() => {
    if (isAllLocations) {
      fetchProjectData(id);
    }

    return () => {
      setState(defaultState);
    };
  }, []);

  const fetchProjectData = id => {
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

  const getSelectedLocationData = () => {
    const selectedParams = Object.keys(selectedLocations).flat();
    if (!selectedParams.length) {
      toggleAllLocations(true);
      return;
    }
    setState(state => ({
      ...state,
      fetching: true,
      error: null,
    }));

    let query = {
      location: Object.values(selectedLocations).flat() || [],
      parameter: selectedParams || [],
    };
    let f = buildAPIQS(query, { arrayFormat: 'repeat' });
    fetch(`${config.api}/locations?${f}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          // combines all parameter data for the selected parameters
          const combinedParameters = json.results
            .map(location => location.parameters)
            .flat()
            .filter(f => selectedParams.includes(f.parameterId.toString()));

          // removes duplicate entries
          const cleanedParams = Array.from(
            new Set(combinedParameters.map(param => param.id))
          ).map(id => {
            return combinedParameters.find(p => p.id === id);
          });
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            locationData: {
              results: json.results,
              parameters: cleanedParams,
            },
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

  const handleLocationSelection = (paramId, locationId) => {
    selectedLocations[paramId]?.includes(locationId)
      ? setSelectedLocations({
          ...selectedLocations,
          [paramId]: selectedLocations[paramId].filter(
            location => location !== locationId
          ),
        })
      : Object.values(selectedLocations).flat().length < 15
      ? setSelectedLocations({
          ...selectedLocations,
          [paramId]: selectedLocations[paramId]
            ? [...selectedLocations[paramId], locationId]
            : [locationId],
        })
      : null;
  };

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingHeader />;
  }

  if (error || !projectData) {
    return <ErrorHeader />;
  }

  const paramsToDisplay =
    locationData && !isAllLocations
      ? // this returns the first of each parameter, this should only be passed to the timeseries chart,
        // but until we get aggregate data from the endpoint, the other items on the dashboard will consume the first location
        Array.from(
          new Set(locationData.parameters.map(param => param.parameterId))
        ).map(parameterId => {
          return locationData.parameters.find(
            p => p.parameterId === parameterId
          );
        })
      : projectData.parameters;

  // Lifecycle stage of different sources.
  const lifecycle = projectData.sources
    .map(s => s.lifecycle_stage)
    .filter(Boolean);

  return (
    <section className="inpage">
      <Header
        tagline="Datasets"
        title={projectData.name}
        subtitle={projectData.subtitle}
        action={{
          api: `${config.apiDocs}`,
          download: () => {},
        }}
        sourceType={projectData.sourceType}
        isMobile={projectData.isMobile}
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
              <Pill
                title={`${Object.values(selectedLocations).flat().length}/15`}
                action={() => toggleAllLocations(true)}
              />
            </div>
            <div style={{ display: `flex`, justifyContent: `flex-end` }}>
              <button
                className="nav__action-link"
                onClick={getSelectedLocationData}
              >
                Apply Selection
              </button>
            </div>
          </div>
        )}
        <DatasetLocations
          bbox={projectData.bbox || getCountryBbox(projectData.countries[0])}
          locationIds={projectData.locationIds}
          parameters={projectData.parameters}
          toggleAllLocations={toggleAllLocations}
          isAllLocations={isAllLocations}
          selectedLocations={selectedLocations}
          handleLocationSelection={handleLocationSelection}
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
            measurements={projectData.measurements}
            lifecycle={lifecycle}
            date={{
              start: projectData.firstUpdated,
              end: projectData.lastUpdated,
            }}
          />
          {/* TODO: pass averages */}
          <LatestMeasurementsCard parameters={paramsToDisplay} />
          <SourcesCard sources={projectData.sources} />
          <TimeSeriesCard
            isProject
            projectId={projectData.id}
            parameters={paramsToDisplay} // TODO: pass averages as well as each location
            dateRange={dateRange}
            titleInfo={
              'The average value of a pollutant over time during the specified window at each individual node selected and the average values across all locations selected. While locations have varying time intervals over which they report, all time series charts show data at the same intervals. For one day or one month of data the hourly average is shown. For the project lifetime the daily averages are shown. If all locations are selected only the average across all locations is shown, not the individual location values.'
            }
          />
          <MeasureandsCard
            parameters={paramsToDisplay} // TODO: pass averages
            titleInfo={
              "The average of all values and total number of measurements for the available pollutants during the chosen time window and for the selected locations. Keep in mind that not all locations may report the same pollutants. What are we doing when the locations aren't reporting the same pollutants?"
            }
          />
          <TemporalCoverageCard
            parameters={paramsToDisplay} // TODO: pass averages
            dateRange={dateRange}
            spatial="project"
            id={projectData.name}
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
