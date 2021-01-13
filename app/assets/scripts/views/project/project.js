import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import qs, { stringify as buildAPIQS } from 'qs';

import { buildQS } from '../../utils/url';
import config from '../../config';
import { getCountryBbox } from '../../utils/countries';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import ProjectDashboard from './project-dashboard';
import LocationsDashboard from './locations-dashboard';
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
    fetchProjectData(id);

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
          style={{ gridTemplateColumns: `1fr`, paddingTop: `4rem` }}
        >
          <h1 className="fold__title">Values for selected stations</h1>
        </header>
        {!isAllLocations && locationData ? (
          <LocationsDashboard
            locationData={locationData}
            measurements={projectData.measurements}
            selectedParams={Object.keys(selectedLocations).flat()}
            lifecycle={lifecycle}
            dateRange={dateRange}
            selectedLocationDates={{
              start: projectData.firstUpdated,
              end: projectData.lastUpdated,
            }}
            sources={projectData.sources}
            locations={Object.values(selectedLocations).flat()}
            country={projectData.countries[0]}
            name={projectData.name}
          />
        ) : (
          <ProjectDashboard
            projectData={projectData}
            lifecycle={lifecycle}
            dateRange={dateRange}
            sources={projectData.sources}
          />
        )}
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
