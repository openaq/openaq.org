import React, { useEffect, useState, useReducer } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import qs from 'qs';

import { openDownloadModal } from '../../actions/action-creators';
import { buildQS } from '../../utils/url';
import config from '../../config';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import Dashboard from './dashboard';
import NodesDashboard from './nodes-dashboard';
import NodeLocations from './node-locations';
import DateSelector from '../../components/date-selector';
import Pill from '../../components/pill';
import { formatValueByUnit, renderUnit } from '../../utils/format';

const projectActions = {
  SET_INITIAL_STATE: 'SET_INITIAL_STATE',
  SELECT_LOCATION: 'SELECT_LOCATION',
  DISPLAY_FETCHED_LOCATION_DATA: 'DISPLAY_FETCHED_LOCATION_DATA',
  TOGGLE_MAP_STATE: 'TOGGLE_MAP_STATE',
};

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  projectData: null,
};

const initialProjectState = {
  isFullProject: true,
  isDisplayingSelectionTools: false,
  selectedLocations: {},
};

function updateSelectedLocation(state, paramId, locationId) {
  const { selectedLocations } = state;
  if (selectedLocations[paramId]?.includes(locationId)) {
    // removes location
    const updatedSelection = {
      ...selectedLocations,
      [paramId]: selectedLocations[paramId].filter(
        location => location !== locationId
      ),
    };
    // removes param if last location was removed
    updatedSelection[paramId].length < 1 && delete updatedSelection[paramId];
    return updatedSelection;
  } else if (Object.values(selectedLocations).flat().length < 15) {
    return {
      ...selectedLocations,
      [paramId]: selectedLocations[paramId]
        ? [...selectedLocations[paramId], locationId]
        : [locationId],
    };
  }
}

function reducer(state, action) {
  switch (action.type) {
    case projectActions.TOGGLE_MAP_STATE:
      return {
        isFullProject: !state.isFullProject ? true : state.isFullProject, // only update if previous state was false
        isDisplayingSelectionTools: !state.isDisplayingSelectionTools,
        selectedLocations: {},
      };
    case projectActions.SET_INITIAL_STATE:
      return initialProjectState;
    case projectActions.SELECT_LOCATION:
      return {
        isFullProject: state.isFullProject,
        isDisplayingSelectionTools: true,
        selectedLocations: updateSelectedLocation(
          state,
          action.paramId,
          action.locationId
        ),
      };
    case projectActions.DISPLAY_FETCHED_LOCATION_DATA:
      return {
        isFullProject: false,
        isDisplayingSelectionTools: true,
        selectedLocations: state.selectedLocations,
      };
    default:
      throw new Error();
  }
}

function Project({ match, history, location, _openDownloadModal }) {
  const { id } = match.params;
  const [projectState, dispatch] = useReducer(reducer, initialProjectState);
  const [dateRange, setDateRange] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).dateRange
  );

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
          const dat = json.results[0];
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            projectData: {
              ...dat,
              parameters: dat.parameters.map(p => ({
                ...p,
                average: formatValueByUnit(
                  p.average,
                  p.unit,
                  renderUnit(p.unit)
                ),
                lastValue: formatValueByUnit(
                  p.lastValue,
                  p.unit,
                  renderUnit(p.unit)
                ),
                unit: renderUnit(p.unit),
              })),
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
    dispatch({ type: projectActions.SELECT_LOCATION, paramId, locationId });
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
        title={projectData.subtitle}
        action={{
          api: `${config.apiDocs}`,
          download: () =>
            _openDownloadModal({
              downloadType: 'projects',
              country: projectData.countries && projectData.countries[0],
              project: projectData.id,
            }),
        }}
        sourceType={projectData.sourceType}
        isMobile={projectData.isMobile}
      />
      <div className="inpage__body">
        <DateSelector setDateRange={setDateRange} dateRange={dateRange} />
        {!projectData.isMobile && projectState.isDisplayingSelectionTools && (
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
                title={`${
                  Object.values(projectState.selectedLocations).flat().length
                }/15`}
                action={() =>
                  dispatch({ type: projectActions.SET_INITIAL_STATE })
                }
              />
            </div>
            {projectState.isFullProject && (
              <div style={{ display: `flex`, justifyContent: `flex-end` }}>
                <button
                  className="nav__action-link"
                  onClick={() =>
                    dispatch({
                      type: projectActions.DISPLAY_FETCHED_LOCATION_DATA,
                    })
                  }
                >
                  View Location Data
                </button>
              </div>
            )}
          </div>
        )}

        {!projectData.isMobile && (
          <NodeLocations
            bbox={projectData.bbox}
            locationIds={projectData.locationIds}
            parameters={projectData.parameters}
            toggleLocationSelection={() =>
              dispatch({ type: projectActions.TOGGLE_MAP_STATE })
            }
            isDisplayingSelectionTools={projectState.isDisplayingSelectionTools}
            selectedLocations={projectState.selectedLocations}
            handleLocationSelection={handleLocationSelection}
          />
        )}
        {!projectData.isMobile && !projectState.isFullProject ? (
          <>
            <header
              className="fold__header inner"
              style={{ gridTemplateColumns: `1fr`, paddingTop: `4rem` }}
            >
              <h1 className="fold__title">Values for selected stations</h1>
            </header>
            <NodesDashboard
              measurements={projectData.measurements}
              projectId={projectData.id}
              projectName={projectData.name}
              selectedParams={Object.keys(projectState.selectedLocations)}
              lifecycle={lifecycle}
              dateRange={dateRange}
              projectDates={{
                start: projectData.firstUpdated,
                end: projectData.lastUpdated,
              }}
              sources={projectData.sources}
              locations={Object.values(projectState.selectedLocations).flat()}
              country={projectData.countries && projectData.countries[0]}
            />
          </>
        ) : (
          <>
            <header
              className="fold__header inner"
              style={{ gridTemplateColumns: `1fr`, paddingTop: `4rem` }}
            >
              <h1 className="fold__title">Values for all stations</h1>
            </header>
            <Dashboard
              bbox={projectData.bbox}
              isMobile={projectData.isMobile}
              locationIds={projectData.locationIds}
              measurements={projectData.measurements}
              projectParams={projectData.parameters}
              projectId={projectData.id}
              projectName={projectData.name}
              lifecycle={lifecycle}
              dateRange={dateRange}
              projectDates={{
                start: projectData.firstUpdated,
                end: projectData.lastUpdated,
              }}
              sources={projectData.sources}
            />
          </>
        )}
      </div>
    </section>
  );
}

Project.propTypes = {
  _openDownloadModal: T.func,
  match: T.object, // from react-router
  history: T.object,
  location: T.object,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function dispatcher(dispatch) {
  return {
    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args)),
  };
}

export default connect(() => ({}), dispatcher)(Project);
