import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';

import {
  fetchLocations as fetchLocationsAction,
  invalidateLocations as invalidateLocationsAction,
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

export default function LocationsHub({
  fetchLocations,
  invalidateLocations,
  openDownloadModal,
  parameters,
  countries,
  sources,
  manufacturers,
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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // on url change
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    setPage(() => getPage(query));

    setFilters({
      order_by: query.order_by && query.order_by.split(','),
      sort: 'desc',
      parameter: query.parameters && query.parameters.split(','),
      country: query.countries && query.countries.split(','),
      source: query.sources && query.sources.split(','),
      // The following are not lists
      isMobile: query.mobility && query.mobility === 'Mobile',
      entity: query.entity && query.entity.toLowerCase(),
      sensorType: query.grade && query.grade.toLowerCase(),
      manufacturerName: query.manufacturer && query.manufacturer,
    });
  }, [location]);

  useEffect(() => {
    if (!isMounted) return;
    fetchLocations(page, filters, PER_PAGE);
    return () => invalidateLocations();
  }, [page, filters, isMounted]);

  function handlePageClick(d) {
    let query = qs.parse(location.search, { ignoreQueryPrefix: true });
    query.page = d.selected + 1;

    history.push(`/locations?${buildQS(query)}`);
  }

  const totalPages = Math.ceil(meta.found / PER_PAGE);

  return (
    <section className="inpage">
      <Header
        title="Locations"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <div className="inpage__body">
        <Filter
          parameters={parameters}
          countries={countries}
          sources={sources}
          manufacturers={manufacturers}
        />
        <div className="constrainer">
          <div className="content__meta">
            <div className="content__header">
              <div className="content__heading">
                <h2 className="content-prime-title">Results</h2>
                {meta.found ? (
                  <p className="results-summary">
                    A total of <strong>{meta.found}</strong> locations were
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
            locations={results}
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

LocationsHub.propTypes = {
  parameters: T.array,

  fetching: T.bool,
  fetched: T.bool,
  error: T.object,
  results: T.array,
  meta: T.object,
  countries: T.array,
  sources: T.array,
  manufacturers: T.array,

  location: T.object,
  history: T.object,

  fetchLocations: T.func,
  invalidateLocations: T.func,
  openDownloadModal: T.func,
};

// /////////////////////////////////////////////////////////////////////
// Connect functions

function selector(state) {
  return {
    parameters: state.baseData.data.parameters,
    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    manufacturers: state.baseData.data.manufacturers,
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

module.exports = connect(selector, dispatcher)(LocationsHub);
