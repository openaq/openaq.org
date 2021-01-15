import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import qs from 'qs';

import { buildQS } from '../../utils/url';
import config from '../../config';
import { getCountryBbox } from '../../utils/countries';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import Dashboard from './dashboard';
import NodesDashboard from './nodes-dashboard';
import NodeLocations from './node-locations';
import DateSelector from '../../components/date-selector';
import Pill from '../../components/pill';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  projectData: null,
};

function Project({ match, history, location }) {
  const { id } = match.params;

  const [dateRange, setDateRange] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).dateRange
  );
  const [isAllLocations, toggleAllLocations] = useState(true);
  const [isDisplayingNodes, toggleNodeDisplay] = useState(false);

  const [selectedLocations, setSelectedLocations] = useState({});
  const [{ fetched, fetching, error, projectData }, setState] = useState(
    defaultState
  );

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

  const handleLocationSelection = (paramId, locationId) => {
    if (selectedLocations[paramId]?.includes(locationId)) {
      setSelectedLocations(prevSelections => {
        // removes location
        const updatedSelection = {
          ...prevSelections,
          [paramId]: selectedLocations[paramId].filter(
            location => location !== locationId
          ),
        };
        // removes param if last location was removed
        updatedSelection[paramId].length < 1 &&
          delete updatedSelection[paramId];
        return updatedSelection;
      });
    } else if (Object.values(selectedLocations).flat().length < 15) {
      setSelectedLocations({
        ...selectedLocations,
        [paramId]: selectedLocations[paramId]
          ? [...selectedLocations[paramId], locationId]
          : [locationId],
      });
    }
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
                action={() => {
                  setSelectedLocations({});
                  toggleAllLocations(true);
                  toggleNodeDisplay(false);
                }}
              />
            </div>
            {!isDisplayingNodes && (
              <div style={{ display: `flex`, justifyContent: `flex-end` }}>
                <button
                  className="nav__action-link"
                  onClick={() => toggleNodeDisplay(true)}
                >
                  Apply Selection
                </button>
              </div>
            )}
          </div>
        )}

        <NodeLocations
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
        {isDisplayingNodes ? (
          <NodesDashboard
            measurements={projectData.measurements}
            projectId={projectData.id}
            projectName={projectData.name}
            selectedParams={Object.keys(selectedLocations)}
            lifecycle={lifecycle}
            dateRange={dateRange}
            selectedLocationDates={{
              start: projectData.firstUpdated,
              end: projectData.lastUpdated,
            }}
            sources={projectData.sources[0].flat()}
            locations={Object.values(selectedLocations).flat()}
            country={projectData.countries && projectData.countries[0]}
          />
        ) : (
          <Dashboard
            measurements={projectData.measurements}
            projectParams={projectData.parameters}
            projectId={projectData.id}
            projectName={projectData.name}
            lifecycle={lifecycle}
            selectedDateRange={dateRange}
            projectDates={{
              start: projectData.firstUpdated,
              end: projectData.lastUpdated,
            }}
            sources={projectData.sources[0].flat()}
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
