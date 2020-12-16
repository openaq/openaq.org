import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';

import _ from 'lodash';

import { formatThousands } from '../../utils/format';
import config from '../../config';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import LocationCard from '../../components/location-card';
import CountryMap from './map';

const defaultLocations = {
  locationFetched: false,
  locationFetching: false,
  locationError: null,
  locations: null,
};

const defaultCountry = {
  countryFetched: false,
  countryFetching: false,
  countryError: null,
  country: null,
};

export default function Country(props) {
  const id = props.match.params.name;
  const [
    { locationFetched, locationFetching, locationError, locations },
    setLocations,
  ] = useState(defaultLocations);
  const [
    { countryFetched, countryFetching, countryError, country },
    setCountry,
  ] = useState(defaultCountry);

  useEffect(() => {
    const fetchLocations = id => {
      setLocations(state => ({
        ...state,
        locationFetching: true,
        locationError: null,
      }));
      let limit = 10000;
      fetch(`${config.api}/locations?limit=${limit}&country=${id}`)
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
              locations: json.results,
            }));
          },
          e => {
            console.log('e', e);
            setLocations(state => ({
              ...state,
              locationFetched: true,
              locationFetching: false,
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
      let limit = 1;
      fetch(`${config.api}/countries?limit=${limit}&country=${id}`)
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
              countryFetched: true,
              countryFetching: false,
              country: json.results[0],
            }));
          },
          e => {
            console.log('e', e);
            setCountry(state => ({
              ...state,
              countryFetched: true,
              countryFetching: false,
              countryError: e,
            }));
          }
        );
    };

    fetchLocations(id);
    fetchCountry(id);

    return () => {
      setLocations(defaultLocations);
      setCountry(defaultCountry);
    };
  }, []);

  function onDownloadClick(data, e) {
    e && e.preventDefault();
    props._openDownloadModal(data);
  }

  // gets sources from locations and uses set to create an array with no duplicates
  const sourceList = locations
    ? Array.from(
        new Set(locations.map(loc => loc.sources[0]).map(JSON.stringify))
      ).map(JSON.parse)
    : null;

  let locationGroups = _(locations).sortBy('city').groupBy('city').value();
  console.log('sourceList', sourceList);
  console.log('locationGroups', Object.entries(locationGroups));

  return (
    <>
      {(countryError || !country) && <ErrorHeader />}
      {countryFetching && <LoadingHeader />}
      {country && locations && (
        <section className="inpage" data-cy="country-page">
          <Header
            id="country"
            tagline="Country"
            title={country.name}
            stats={[
              { number: country.cities, label: 'areas' },
              {
                number: country.locations,
                label: country.locations > 1 ? 'locations' : 'location',
              },
              {
                number: formatThousands(country.count),
                label: 'measurements',
              },
              {
                number: sourceList.length,
                label: sourceList.length > 1 ? 'sources' : 'source',
              },
            ]}
            action={{
              api: config.apiDocs,
              download: () =>
                onDownloadClick(null, {
                  country: id,
                }),
            }}
          />
          <div className="inpage__body">
            <CountryMap />
            {locationFetching && <LoadingMessage />}
            {locationError && <InfoMessage standardMessage />}
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
                          {locations.length}{' '}
                          {locations.length > 1 ? 'locations' : 'location'}
                        </small>
                      </h1>
                      <p className="fold__main-action">
                        <a
                          href="#"
                          className="location-download-button"
                          title={`Download ${city} data`}
                          onClick={() =>
                            onDownloadClick(null, {
                              country: id,
                              area: city,
                            })
                          }
                        >
                          Download
                        </a>
                      </p>
                    </header>
                    <div className="fold__body">
                      <ul className="country-locations-list">
                        {cityLocations.map(loc => (
                          <li key={loc.id}>
                            <LocationCard
                              onDownloadClick={() =>
                                props._openDownloadModal({
                                  country: id,
                                  area: city,
                                  location: loc.name,
                                })
                              }
                              id={loc.id}
                              name={loc.name}
                              city={loc.city}
                              countryData={{ name: country.name }}
                              sourcesData={sourceList}
                              totalMeasurements={loc.measurements}
                              parametersList={loc.parameters}
                              lastUpdate={loc.lastUpdated}
                              collectionStart={loc.firstUpdated}
                              compact
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

Country.propTypes = {
  match: T.object,

  _openDownloadModal: T.func,

  countries: T.array,
  sources: T.array,
  parameters: T.array,

  latestMeasurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),

  locations: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
