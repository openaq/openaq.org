import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import { buildAPIQS } from 'qs';

import { formatThousands } from '../../utils/format';
import config from '../../config';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';

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
  console.log('data', locations, country);

  // if (!locationFetched || countryFetched && !locationFetching ) {
  //   return null;
  // }

  function onDownloadClick() {
    props._openDownloadModal({
      country: data.country,
      area: data.city,
      location: data.location,
    });
  }
  console.log('data', locations, country);
  // TODO remove need for this with updated endpoint result
  // let countryData = _.find(this.props.countries, {
  //   code: this.props.match.params.name,
  // });
  // let sourcesData = _.filter(this.props.sources, {
  //   country: this.props.match.params.name,
  // });

  return (
    <>
      {(countryError || !country) && <ErrorHeader />}
      {countryFetching && <LoadingHeader />}
      {country && (
        <section className="inpage">
          <Header
            id="country"
            tagline="Country"
            title={country.name}
            stats={[
              { number: '1', label: 'areas' },
              { number: country.locations, label: 'locations' },
              {
                number: formatThousands(country.count),
                label: 'measurements',
              },
              { number: '1', label: 'source' },
            ]}
            action={{
              api: `${config.api}/locations?location=${id}`,
              download: onDownloadClick,
            }}
          />
        </section>
      )}
    </>
  );
}

Country.propTypes = {
  match: T.object,

  _invalidateAllLocationData: T.func,
  _fetchLocations: T.func,
  _fetchLatestMeasurements: T.func,
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
