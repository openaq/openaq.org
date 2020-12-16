import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';

import _ from 'lodash';

import { formatThousands } from '../../utils/format';
import config from '../../config';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
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

  function onDownloadClick() {
    props._openDownloadModal({
      country: data.country,
      area: data.city,
      location: data.location,
    });
  }

  // gets sources from locations and uses set to create an array with no duplicates
  const sourceList = locations
    ? Array.from(
        new Set(locations.map(loc => loc.sources[0]).map(JSON.stringify))
      ).map(JSON.parse)
    : null;

  let groupped = _(locations).sortBy('city').groupBy('city').value();

  // let countriesList = _.map(groupped, (locations, k) => {
  //   //   let dlClick = onDownloadClick(null, {
  //   //     country: this.props.match.params.name,
  //   //     area: k,
  // });

  console.log('groupped', groupped);
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
              api: `${config.api}/locations?location=${id}`,
              download: onDownloadClick,
            }}
          />
          <div className="inpage__body">
            <CountryMap />
            {locationFetching && <LoadingMessage />}
            {locationError && <InfoMessage standardMessage />}
            <div className="countries-list"></div>
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
