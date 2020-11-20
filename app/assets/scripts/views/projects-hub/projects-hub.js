import React, { useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';

import {
  fetchLocations as fetchLocationsAction,
  invalidateLocations as invalidateLocationsAction,
  openDownloadModal as openDownloadModalAction,
} from '../../actions/action-creators';

import Header from './header';
import Filter from './filter';
import Results from './results';

const PER_PAGE = 15;

function getPage(location) {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  if (query && query.page) {
    let page = query.page;
    page = isNaN(page) || page < 1 ? 1 : +page;
    return page;
  }
}

export default function ProjectsHub({
  fetchLocations,
  invalidateLocations,
  openDownloadModal,

  organizations,
  sources,
  parameters,

  fetching,
  fetched,
  error,
  results,
  meta,

  location,
}) {
  const page = getPage(location);
  const filters = {};

  useEffect(() => {
    fetchLocations(page, filters, PER_PAGE);
    return () => {
      invalidateLocations();
    };
  }, []);

  return (
    <section className="inpage">
      <Header
        title="Datasets"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <div className="inpage__body">
        <div className="inner">
          <div className="inpage__content">
            <div className="inpage__content__header">
              <Filter
                organizations={organizations}
                parameters={parameters}
                sources={sources}
              />
            </div>

            <div className="content__meta">
              <div className="content__header">
                <div className="content__heading">
                  <h2 className="content-prime-title">Results</h2>
                  {meta.found ? (
                    <p className="results-summary">
                      A total of <strong>{meta.found}</strong> datasets were
                      found
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="inpage__results">
              <Results
                fetched={fetched}
                fetching={fetching}
                error={error}
                projects={results}
                openDownloadModal={openDownloadModal}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ProjectsHub.propTypes = {
  organizations: T.array,
  sources: T.array,
  parameters: T.array,

  fetching: T.bool,
  fetched: T.bool,
  error: T.object,
  results: T.array,
  meta: T.object,
};

// /////////////////////////////////////////////////////////////////////
// Connect functions

function selector(state) {
  return {
    organizations: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,

    fetching: state.locations.fetching,
    fetched: state.locations.fetched,
    error: state.locations.error,
    results: state.locations.data.results,
    meta: state.locations.data.meta,
  };
}

function dispatcher(dispatch) {
  return {
    fetchLocations: (...args) => dispatch(fetchLocationsAction(...args)),
    invalidateLocations: (...args) =>
      dispatch(invalidateLocationsAction(...args)),
    openDownloadModal: (...args) => dispatch(openDownloadModalAction(...args)),
  };
}

module.exports = connect(selector, dispatcher)(ProjectsHub);
