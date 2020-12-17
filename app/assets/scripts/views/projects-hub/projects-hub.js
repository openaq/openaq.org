import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';

import {
  fetchProjects as fetchProjectsAction,
  invalidateProjects as invalidateProjectsAction,
  openDownloadModal as openDownloadModalAction,
} from '../../actions/action-creators';
import { buildQS } from '../../utils/url';

import Header from '../../components/header';
import Filter from './filter';
import Results from './results';

const PER_PAGE = 15;

function getPage(query) {
  if (query && query.page) {
    let page = query.page;
    page = isNaN(page) || page < 1 ? 1 : +page;
    return page;
  }
  return 1;
}

export default function ProjectsHub({
  fetchProjects,
  invalidateProjects,
  openDownloadModal,

  parameters,

  fetching,
  fetched,
  error,
  results,
  meta,

  location,
  history,
}) {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    // on url change
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    setPage(() => getPage(query));
    setFilters({
      order_by: query.order_by,
      sort: 'asc',
      parameter: query.parameters,
    });
  }, [location]);

  useEffect(() => {
    fetchProjects(page, filters, PER_PAGE);
    return () => {
      invalidateProjects();
    };
  }, [page, filters]);

  function handlePageClick(d) {
    let query = qs.parse(location.search, { ignoreQueryPrefix: true });
    query.page = d.selected + 1;

    history.push(`/projects?${buildQS(query)}`);
  }

  const totalPages = Math.ceil(meta.found / PER_PAGE);

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
              <Filter parameters={parameters} />
            </div>

            <div className="content__meta">
              <div className="content__header">
                <div className="content__heading">
                  <h2 className="content-prime-title">Results</h2>
                  {meta.found ? (
                    <p className="results-summary" data-cy="results-summary">
                      A total of <strong>{meta.found}</strong> datasets were
                      found
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <Results
              fetched={fetched}
              fetching={fetching}
              error={error}
              projects={results}
              totalPages={totalPages}
              page={page}
              openDownloadModal={openDownloadModal}
              handlePageClick={handlePageClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

ProjectsHub.propTypes = {
  parameters: T.array,

  fetching: T.bool,
  fetched: T.bool,
  error: T.object,
  results: T.array,
  meta: T.object,

  location: T.object,
  history: T.object,

  fetchProjects: T.func,
  invalidateProjects: T.func,
  openDownloadModal: T.func,
};

// /////////////////////////////////////////////////////////////////////
// Connect functions

function selector(state) {
  return {
    parameters: state.baseData.data.parameters,

    fetching: state.projects.fetching,
    fetched: state.projects.fetched,
    error: state.projects.error,
    results: state.projects.data.results,
    meta: state.projects.data.meta,
  };
}

function dispatcher(dispatch) {
  return {
    fetchProjects: (...args) => dispatch(fetchProjectsAction(...args)),
    invalidateProjects: (...args) =>
      dispatch(invalidateProjectsAction(...args)),
    openDownloadModal: (...args) => dispatch(openDownloadModalAction(...args)),
  };
}

module.exports = connect(selector, dispatcher)(ProjectsHub);
