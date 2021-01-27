import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';

import { getCountryBbox } from '../../utils/countries';
import { formatThousands } from '../../utils/format';
import config from '../../config';
import { openDownloadModal } from '../../actions/action-creators';
import { ParameterProvider } from '../../context/parameter-context';

import Header, { LoadingHeader, ErrorHeader } from '../../components/header';
import MapComponent from '../../components/map';
import LocationsSource from '../../components/map/locations-source';
import LocationsLayer from '../../components/map/locations-layer';
import Legend from '../../components/map/legend';
import Results from './results';

const defaultCountry = {
  countryFetching: false,
  countryError: null,
  country: null,
};

function Country({ match, _openDownloadModal }) {
  const id = match.params.name;

  const [{ countryFetching, countryError, country }, setCountry] = useState(
    defaultCountry
  );

  useEffect(() => {
    fetchCountry(id);

    return () => {
      setCountry(defaultCountry);
    };
  }, [id]);

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

  return (
    <section className="inpage" data-cy="country-page">
      {countryFetching ? (
        <LoadingHeader />
      ) : country && !countryError ? (
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
                    <LocationsSource>
                      <LocationsLayer country={country.code} />
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

              <Results id={id} openDownloadModal={_openDownloadModal} />
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
