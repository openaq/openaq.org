import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import qs from 'qs';

import {
  fetchLocations as fetchLocationsAction,
  invalidateLocations as invalidateLocationsAction,
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

export default function LocationsHub({
  fetchLocations,
  invalidateLocations,
  openDownloadModal,
  fetchBaseData,

  fetching,
  fetched,
  error,
  results,
  meta,
  countries,

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
    setPage(prev => {
      const cur = getPage(query);
      if (prev === cur) {
        // This means that only filters have updated
        // Reset page to 1
        return 1;
      }
      return cur;
    });

    setFilters({
      // In the front end we are using param 'area', but this is
      // mapped to 'city' before getting sent to backend.
      order_by: query.order_by === 'City/Region' ? 'city' : query.order_by,
      sort: 'desc',
      parameter: query.parameters && query.parameters.split(','),
      country: query.countries && query.countries.split(','),
      sourceName: query.sources && query.sources.split(','),
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
    let query = qs.parse(location.search, { ignoreQueryPrefix: true });

    // If page and query are out of sync we need to sync
    if (page !== Number(query.page)) {
      query.page = `${page}`;
      history.push(`/locations?${buildQS(query)}`);
    }

    return () => invalidateLocations();
  }, [page, filters, isMounted]);

  function handlePageClick(d) {
    let query = qs.parse(location.search, { ignoreQueryPrefix: true });
    query.page = d.selected + 1;
    history.push(`/locations?${buildQS(query)}`);
  }

  useEffect(() => {
    fetchBaseData();
  }, []);

  const countryCount = countries ? countries.length : 'many';

  const totalPages = Math.ceil(meta.found / PER_PAGE);

  return (
    <section className="inpage">
      <HubHeader title="Location" countriesCount={countryCount} />

      <div className="inpage__body">
        <Filter
          slug="/locations"
          by={['parameters', 'countries', 'sources', 'sensor']}
          orderByOptions={['location', 'country', 'City/Region', 'count']}
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
  fetching: T.bool,
  fetched: T.bool,
  error: T.object,
  results: T.array,
  meta: T.object,
  countries: T.array,

  location: T.object,
  history: T.object,

  fetchBaseData: T.func,
  fetchLocations: T.func,
  invalidateLocations: T.func,
  openDownloadModal: T.func,
};

// /////////////////////////////////////////////////////////////////////
// Connect functions

function selector(state) {
  return {
    fetching: state.locations.fetching,
    fetched: state.locations.fetched,
    error: state.locations.error,
    results: state.locations.data.results,
    meta: state.locations.data.meta,
    countries: state.baseData.countries,
  };
}

function dispatcher(dispatch) {
  return {
    fetchLocations: (...args) => dispatch(fetchLocationsAction(...args)),
    invalidateLocations: (...args) =>
      dispatch(invalidateLocationsAction(...args)),
    openDownloadModal: (...args) => dispatch(openDownloadModalAction(...args)),
    fetchBaseData: (...args) => dispatch(fetchBaseDataAction(...args)),
  };
}

module.exports = connect(selector, dispatcher)(LocationsHub);
