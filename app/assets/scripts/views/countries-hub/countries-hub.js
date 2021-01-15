import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import config from '../../config';
import { sortBy } from 'lodash';
import { formatThousands } from '../../utils/format';
import { openDownloadModal } from '../../actions/action-creators';
import Card, { CardDetails, FooterActions } from '../../components/card';
import Header from '../../components/header';
import ErrorMessage from '../../components/error-message';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  countries: null,
};

export default function CountriesHub({ _openDownloadModal }) {
  const [{ fetched, fetching, error, countries }, setState] = useState(
    defaultState
  );

  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetching: true, error: null }));

      fetch(`${config.api}/countries`)
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              data: json.results,
            }));
          },
          e => {
            console.log('e', e);
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              error: e,
            }));
          }
        );
    };

    fetchData();

    return () => {
      setState(defaultState);
    };
  }, []);

  const onDownloadClick = (country, e) => {
    e.preventDefault();
    _openDownloadModal({ country: country });
  };

  const countryCount = fetching
    ? '...'
    : fetched && !error
    ? countries.length
    : 'many';

  return (
    <section className="inpage">
      <Header
        title="Browse by Country"
        description={
          <>
            We are currently collecting data in {countryCount} different
            countries and are always seeking to add more. We aggregate PM2.5,
            PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2),
            carbon monoxide (CO), and black carbon (BC) from real-time
            government and research grade sources. If you cannot find the
            location that you are looking for, please{' '}
            <a
              href="https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform"
              title="Suggest a new source"
            >
              suggest a source
            </a>{' '}
            and{' '}
            <a href="mailto:info@openaq.org" title="Contact openaq">
              send us an email
            </a>
            . The last 2 years of data are accessible here. Learn how to access
            older data{' '}
            <a
              href="https://medium.com/@openaq/how-in-the-world-do-you-access-air-quality-data-older-than-90-days-on-the-openaq-platform-8562df519ecd"
              title="Access older data"
            >
              here
            </a>
            .
          </>
        }
        disclaimer={true}
        action={{ api: config.apiDocs }}
      />
      <div className="inpage__body">
        <div className="fold">
          {fetched && countries ? (
            <div className="inner">
              <ol className="country-list">
                {sortBy(countries, 'name').map(o => (
                  <li className="country-list__item" key={o.code}>
                    <Card
                      title={
                        <Link
                          to={`/countries/${o.code}`}
                          title={`View ${o.name} page`}
                        >
                          {o.name || 'N/A'}
                        </Link>
                      }
                      renderBody={() => (
                        <CardDetails
                          list={[
                            {
                              label: 'Measurements',
                              value: formatThousands(o.count),
                            },
                            {
                              label: 'Locations',
                              value: formatThousands(o.locations),
                            },
                          ]}
                        />
                      )}
                      renderFooter={() => (
                        <FooterActions
                          what={o.name}
                          onDownloadClick={e => onDownloadClick(e, o.code)}
                          viewMorePath={`/countries/${o.code}`}
                        />
                      )}
                    />
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <ErrorMessage instructions={`${error}`} />
          )}
        </div>
      </div>
    </section>
  );
}

CountriesHub.propTypes = {
  _openDownloadModal: T.func,
  countries: T.array,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    countries: state.baseData.data.countries,
  };
}

function dispatcher(dispatch) {
  return {
    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args)),
  };
}

module.exports = connect(selector, dispatcher)(CountriesHub);
