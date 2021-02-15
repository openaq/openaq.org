import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import qs from 'qs';

import { buildQS } from '../../utils/url';
import { NO_CITY } from '../../utils/constants';
import config from '../../config';
import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import LocationCard from '../locations-hub/location-card';

const defaultLocations = {
  fetching: false,
  fetched: false,
  error: null,
  locations: null,
  meta: null,
};
const PER_PAGE = 30;

function getPage(query) {
  if (query && query.page) {
    let page = query.page;
    page = isNaN(page) || page < 1 ? 1 : +page;
    return page;
  }
  return 1;
}

export default function Results({ id, openDownloadModal }) {
  let history = useHistory();
  let location = useLocation();

  const [page, setPage] = useState(1);

  const [
    { fetching, fetched, error, locations, meta },
    setLocations,
  ] = useState(defaultLocations);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    setPage(() => getPage(query));
  }, [location]);

  useEffect(() => {
    if (!isMounted) return;

    fetchLocations(id, page);

    return () => {
      setLocations(defaultLocations);
    };
  }, [isMounted, page]);

  const fetchLocations = (id, page) => {
    setLocations(state => ({
      ...state,
      fetching: true,
      fetched: false,
      error: null,
    }));

    fetch(
      `${config.api}/locations?page=${page}&limit=${PER_PAGE}&metadata=true&country=${id}&order_by=city&sort=asc`
    )
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          setLocations(state => ({
            ...state,
            fetched: true,
            fetching: false,
            locations: json.results,
            meta: json.meta,
          }));
        },
        e => {
          console.log('e', e);
          setLocations(state => ({
            ...state,
            fetching: false,
            fetched: false,
            error: e,
          }));
        }
      );
  };

  function handlePageClick(d) {
    let query = qs.parse(id, location.search, { ignoreQueryPrefix: true });
    const pageNumber = d.selected + 1;
    query.page = pageNumber;
    setPage(pageNumber);

    history.push(`/countries/${id}?${buildQS(query)}`);
  }

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingMessage />;
  }

  if (error) {
    return <InfoMessage standardMessage />;
  }

  let locationGroups = _(locations).sortBy('name').groupBy('city').value();
  const totalPages = meta && Math.ceil(meta.found / PER_PAGE);

  if (!Object.values(locationGroups).length) {
    return (
      <InfoMessage>
        <p>No data was found for your criteria.</p>
        <p>
          Maybe you&apos;d like to suggest a{' '}
          <a
            href="https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform"
            title="Suggest a new source"
          >
            new source
          </a>{' '}
          or{' '}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            let us know
          </a>{' '}
          what location you&apos;d like to see data for.
        </p>
      </InfoMessage>
    );
  }
  return (
    <>
      <div className="countries-list">
        {Object.entries(locationGroups).map(([city, cityLocations]) => (
          <section
            className="fold fold--locations"
            key={city}
            data-cy="country-list"
          >
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">
                  {city}{' '}
                  <small>
                    {cityLocations.length}{' '}
                    {cityLocations.length > 1 ? 'locations' : 'location'}
                  </small>
                </h1>
                <p className="fold__main-action">
                  <a
                    href="#"
                    className="location-download-button"
                    title={`Download ${city} data`}
                    onClick={() =>
                      openDownloadModal({
                        country: id,
                        area: city,
                      })
                    }
                  >
                    Download
                  </a>
                </p>
              </header>
              <div className="inpage__results">
                {cityLocations.map(loc => {
                  let openModal = () =>
                    openDownloadModal({
                      country: loc.country,
                      area: loc.city,
                      location: loc.id,
                    });
                  return (
                    <LocationCard
                      isMobile={loc.isMobile}
                      key={loc.id}
                      city={loc.city || NO_CITY}
                      country={loc.country}
                      firstUpdated={loc.firstUpdated}
                      id={loc.id}
                      lastUpdated={loc.lastUpdated}
                      isAnalysis={loc.isAnalysis}
                      name={loc.name}
                      onDownloadClick={openModal}
                      parametersList={loc.parameters}
                      sources={loc.sources || []}
                      sensorType={loc.sensorType}
                      entity={loc.entity}
                      totalMeasurements={loc.measurements}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
      {!(!fetched || error || !Object.values(locationGroups).length) && (
        <ReactPaginate
          previousLabel={<span>previous</span>}
          nextLabel={<span>next</span>}
          breakLabel={<span className="pages__page">...</span>}
          pageCount={totalPages}
          forcePage={page - 1}
          marginPagesDisplayed={4}
          pageRangeDisplayed={4}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages'}
          pageClassName={'pages__wrapper'}
          pageLinkClassName={'pages__page'}
          activeClassName={'active'}
        />
      )}
    </>
  );
}

Results.propTypes = {
  id: PropTypes.string.isRequired,
  openDownloadModal: PropTypes.func.isRequired,
};
