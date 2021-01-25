import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import qs from 'qs';

import { buildQS } from '../../utils/url';
import { getCountryBbox } from '../../utils/countries';
import { formatThousands } from '../../utils/format';
import config from '../../config';
import { openDownloadModal } from '../../actions/action-creators';
import { ParameterProvider } from '../../context/parameter-context';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import MeasurementsLayer from '../../components/map/measurements-layer';
import Legend from '../../components/map/legend';
import Results from './results';

const defaultLocations = {
  locationFetching: false,
  locationFetched: false,
  locationError: null,
  locations: null,
  locationMeta: null,
};

const defaultCountry = {
  countryFetching: false,
  countryError: null,
  country: null,
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

function Country({ match, history, location, _openDownloadModal }) {
  const id = match.params.name;
  const [
    {
      locationFetching,
      locationFetched,
      locationError,
      locations,
      locationMeta,
    },
    setLocations,
  ] = useState(defaultLocations);
  const [{ countryFetching, countryError, country }, setCountry] = useState(
    defaultCountry
  );
  const [page, setPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    setPage(() => getPage(query));
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    fetchLocations(id, page);
    fetchCountry(id);

    return () => {
      setLocations(defaultLocations);
      setCountry(defaultCountry);
    };
  }, [id, page, isMounted]);

  const fetchLocations = (id, page) => {
    setLocations(state => ({
      ...state,
      locationFetching: true,
      locationFetched: false,
      locationError: null,
    }));

    fetch(
      `${config.api}/locations?page=${page}&limit=${PER_PAGE}&metadata=true&country=${id}`
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
            locationFetching: false,
            locationFetched: true,
            locations: json.results,
            locationMeta: json.meta,
          }));
        },
        e => {
          console.log('e', e);
          setLocations(state => ({
            ...state,
            locationFetching: false,
            locationFetched: false,
            locationError: e,
          }));
        }
      );
  };

  const fetchCountry = id => {
    setCountry(state => ({
      ...state,
      countryFetching: true,
      countryError: null,
    }));
    fetch(`${config.api}/countries/${id}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          setCountry(state => ({
            ...state,
            countryFetching: false,
            country: json.results[0],
          }));
        },
        e => {
          console.log('e', e);
          setCountry(state => ({
            ...state,
            countryFetching: false,
            countryError: e,
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

  let locationGroups = _(locations).sortBy('city').groupBy('city').value();
  const totalPages = locationMeta && Math.ceil(locationMeta.found / PER_PAGE);
  return (
    <section className="inpage" data-cy="country-page">
      {countryFetching || locationFetching ? (
        <LoadingHeader />
      ) : country && locations && !countryError ? (
        <>
          <Header
            id="country"
            tagline="Country"
            title={country.name}
            stats={[
              {
                number: country.locations,
                label: country.locations > 1 ? 'locations' : 'location',
              },
              {
                number: formatThousands(country.count),
                label: 'measurements',
              },
              {
                number: country.sources,
                label: country.sources > 1 ? 'sources' : 'source',
              },
            ]}
            action={{
              api: config.apiDocs,
              download: () =>
                _openDownloadModal({
                  country: id,
                }),
            }}
          />
          <div className="inpage__body">
            <div className="constrainer">
              <section className="fold" id="country-fold-map">
                <div className="fold__body">
                  <MapComponent
                    bbox={getCountryBbox(country.code)}
                    scrollZoomDisabled
                  >
                    <LocationsSource activeParameter={2}>
                      <MeasurementsLayer
                        activeParameter={2}
                        country={country.code}
                      />
                    </LocationsSource>
                    <ParameterProvider>
                      <Legend
                        activeParameter={{
                          parameterId: 2,
                          displayName: 'PM2.5',
                        }}
                      />
                    </ParameterProvider>
                  </MapComponent>
                </div>
              </section>

              {locationFetching ? (
                <LoadingMessage />
              ) : !locationError ? (
                <Results
                  fetched={locationFetched}
                  fetching={locationFetching}
                  error={locationError}
                  locationGroups={locationGroups}
                  id={id}
                  totalPages={totalPages}
                  page={page}
                  openDownloadModal={_openDownloadModal}
                  handlePageClick={handlePageClick}
                />
              ) : (
                <InfoMessage standardMessage />
              )}
            </div>
          </div>
        </>
      ) : (
        <ErrorHeader />
      )}
    </section>
  );
}

Country.propTypes = {
  match: T.object,
  location: T.object,
  history: T.object,
  _openDownloadModal: T.func,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function dispatcher(dispatch) {
  return {
    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args)),
  };
}

export default connect(null, dispatcher)(Country);
