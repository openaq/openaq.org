import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';

import {
  fetchProjects as fetchProjectsAction,
  invalidateProjects as invalidateProjectsAction,
  openDownloadModal as openDownloadModalAction,
  fetchBaseData as fetchBaseDataAction,
} from '../../actions/action-creators';
import { buildQS } from '../../utils/url';

import { HubHeader } from '../../components/header';
import Filter from '../../components/filter';
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
  fetchBaseData,
  fetching,
  fetched,
  error,
  results,
  meta,
  location,
  history,
  countries,
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
      // In the front end we are using param 'area', but this is
      // mapped to 'city' before getting sent to backend.
      order_by: query.order_by === 'area' ? 'city' : query.order_by,
      sort: 'desc',
      parameter: query.parameters && query.parameters.split(','),
      country: query.countries && query.countries.split(','),
      sourceName: query.sources && query.sources.split(','),
      // The following are not lists
      isMobile: query.mobility && query.mobility === 'Mobile',
      isAnalysis: query.procLevel && query.proecLevel === 'Analysis',
      entity: query.entity && query.entity.toLowerCase(),
      sensorType: query.grade && query.grade.toLowerCase(),
      manufacturerName: query.manufacturer && query.manufacturer,
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

  useEffect(() => {
    fetchBaseData();
  }, []);

  const countryCount = countries ? countries.length : 'many';

  const totalPages = Math.ceil(meta.found / PER_PAGE);

  return (
    <section className="inpage">
      <HubHeader title="Dataset" countriesCount={countryCount} />

      <div className="inpage__body">
        <Filter
          slug="/projects"
          by={[
            'parameters',
            'countries',
            'sources',
            'processing-level',
            'sensor',
          ]}
          orderByOptions={[
            'id',
            'name',
            'subtitle',
            'firstUpdated',
            'lastUpdated',
          ]}
        />
        <div className="constrainer">
          <div className="content__meta">
            <div className="content__header">
              <div className="content__heading">
                <h2 className="content-prime-title">Results</h2>
                {meta.found ? (
                  <p className="results-summary" data-cy="results-summary">
                    A total of <strong>{meta.found}</strong> datasets were found
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
    </section>
  );
}

ProjectsHub.propTypes = {
  fetching: T.bool,
  fetched: T.bool,
  error: T.object,
  results: T.array,
  meta: T.object,
  countries: T.array,

  location: T.object,
  history: T.object,

  fetchProjects: T.func,
  invalidateProjects: T.func,
  openDownloadModal: T.func,
  fetchBaseData: T.func,
};

// /////////////////////////////////////////////////////////////////////
// Connect functions

function selector(state) {
  return {
    fetching: state.projects.fetching,
    fetched: state.projects.fetched,
    error: state.projects.error,
    results: state.projects.data.results,
    meta: state.projects.data.meta,
    countries: state.baseData.data.countries,
  };
}

function dispatcher(dispatch) {
  return {
    fetchProjects: (...args) => dispatch(fetchProjectsAction(...args)),
    invalidateProjects: (...args) =>
      dispatch(invalidateProjectsAction(...args)),
    openDownloadModal: (...args) => dispatch(openDownloadModalAction(...args)),
    fetchBaseData: (...args) => dispatch(fetchBaseDataAction(...args)),
  };
}

module.exports = connect(selector, dispatcher)(ProjectsHub);
