'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import createReactClass from 'create-react-class';

import config from '../config';
import { formatThousands } from '../utils/format';
import {
  fetchLocations,
  invalidateAllLocationData,
  fetchLatestMeasurements,
  openDownloadModal,
} from '../actions/action-creators';
import { generateLegendStops } from '../utils/colors';
import { getCountryBbox } from '../utils/countries';
import InfoMessage from '../components/info-message';
import LoadingMessage from '../components/loading-message';
import LocationCard from '../components/location-card';
import MapComponent from '../components/map';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var Country = createReactClass({
  displayName: 'Country',

  propTypes: {
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
  },

  shouldFetchData: function (prevProps) {
    let prevCountry = prevProps.match.params.name;
    let currCountry = this.props.match.params.name;

    return prevCountry !== currCountry;
  },

  fetchData: function () {
    this.props._fetchLocations(
      1,
      {
        country: this.props.match.params.name,
      },
      1000
    );
    this.props._fetchLatestMeasurements({
      country: this.props.match.params.name,
      has_geo: 'true',
    });
  },

  onDownloadClick: function (data, e) {
    e && e.preventDefault();
    this.props._openDownloadModal(data);
  },

  //
  // Start life-cycle methods
  //

  componentDidMount: function () {
    this.fetchData();
  },

  componentDidUpdate: function (prevProps) {
    // this.props._invalidateAllLocationData();
    this.shouldFetchData(prevProps) && this.fetchData();
  },

  //
  // Start render methods
  //

  renderCountryList: function () {
    let {
      fetched,
      fetching,
      error,
      data: { results },
    } = this.props.locations;
    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return <LoadingMessage />;
    }

    if (error) {
      return (
        <InfoMessage>
          <h2>Uhoh, something went wrong.</h2>
          <p>
            There was a problem getting the data. If you continue to have
            problems, please let us know.
          </p>
          <a href="mailto:info@openaq.org" title="Send us an email">
            Send us an Email
          </a>
        </InfoMessage>
      );
    }

    let groupped = _(results).sortBy('city').groupBy('city').value();

    let countriesList = _.map(groupped, (locations, k) => {
      let dlClick = this.onDownloadClick.bind(null, {
        country: this.props.match.params.name,
        area: k,
      });
      return (
        <section
          className="fold fold--locations"
          key={k}
          data-cy="country-list"
        >
          <div className="inner">
            <header className="fold__header">
              <h1 className="fold__title">
                {k}{' '}
                <small>
                  {locations.length}{' '}
                  {locations.length > 1 ? 'locations' : 'location'}
                </small>
              </h1>
              <p className="fold__main-action">
                <a
                  href="#"
                  className="location-download-button"
                  title={`Download ${k} data`}
                  onClick={dlClick}
                >
                  Download
                </a>
              </p>
            </header>
            <div className="fold__body">
              <ul className="country-locations-list">
                {locations.map(o => {
                  let countryData = _.find(this.props.countries, {
                    code: o.country,
                  });
                  let sourcesData = o.sourceNames
                    ? o.sourceNames
                        .map(s => _.find(this.props.sources, { name: s }))
                        .filter(s => s)
                    : [];
                  let params = o.parameters;
                  let openModal = () =>
                    this.props._openDownloadModal({
                      country: o.country,
                      area: o.city,
                      location: o.location,
                    });
                  return (
                    <li key={o.id}>
                      <LocationCard
                        onDownloadClick={openModal}
                        id={o.id}
                        name={o.location || o.name}
                        city={o.city}
                        countryData={countryData}
                        sourcesData={sourcesData}
                        totalMeasurements={o.count}
                        parametersList={params}
                        lastUpdate={o.lastUpdated}
                        collectionStart={o.firstUpdated}
                        compact
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      );
    });

    return <div className="countries-list">{countriesList}</div>;
  },

  renderMap: function () {
    let {
      fetched,
      fetching,
      error,
      data: { results },
    } = this.props.latestMeasurements;
    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return <LoadingMessage />;
    }

    if (error) {
      return (
        <InfoMessage>
          <h2>Uh oh, something went wrong.</h2>
          <p>
            There was a problem getting the data. If you continue to have
            problems, please let us know.
          </p>
          <a href="mailto:info@openaq.org" title="Send us an email">
            Send us an Email
          </a>
        </InfoMessage>
      );
    }

    const scaleStops = generateLegendStops('pm25');
    const colorWidth = 100 / scaleStops.length;
    const bbox = getCountryBbox(this.props.match.params.name);
    console.log(
      'props',
      results.filter(r => r.country === 'CY')
    );

    return (
      <section className="fold" id="country-fold-map" data-cy="country-map">
        <div className="fold__body">
          <MapComponent
            bbox={bbox}
            zoom={1}
            measurements={results}
            parameter={_.find(this.props.parameters, { id: 'pm25' })}
            sources={this.props.sources}
            disableScrollZoom
          >
            <div>
              <p>Showing most recent values for PM2.5</p>
              <ul className="color-scale">
                {scaleStops.map(o => (
                  <li
                    key={o.label}
                    style={{
                      backgroundColor: o.color,
                      width: `${colorWidth}%`,
                    }}
                    className="color-scale__item"
                  >
                    <span className="color-scale__value">{o.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </MapComponent>
        </div>
      </section>
    );
  },

  render: function () {
    let countryData = _.find(this.props.countries, {
      code: this.props.match.params.name,
    });
    let sourcesData = _.filter(this.props.sources, {
      country: this.props.match.params.name,
    });

    return (
      <section className="inpage" data-cy="country-header">
        <header className="inpage__header">
          <div className="inner">
            <div className="inpage__headline">
              <p className="inpage__subtitle" data-cy="country-header-subtitle">
                Country
              </p>
              <h1 className="inpage__title" data-cy="country-header-title">
                {countryData.name}
              </h1>

              <ul className="country-stats" data-cy="country-stats">
                <li data-cy="country-stats-areas">
                  <strong>{countryData.cities}</strong> areas
                </li>
                <li data-cy="country-stats-locations">
                  <strong>{countryData.locations}</strong> locations
                </li>
                <li data-cy="country-stats-measurements">
                  <strong>{formatThousands(countryData.count)}</strong>{' '}
                  measurements
                </li>
                <li data-cy="country-stats-sources">
                  <strong>{sourcesData.length}</strong>{' '}
                  {sourcesData.length > 1 ? 'sources' : 'source'}
                </li>
              </ul>

              <ul className="ipha">
                <li>
                  <a
                    data-cy="header-apidocs-btn"
                    href={config.apiDocs}
                    title="View API documentation"
                    className="ipha-api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View API Docs
                  </a>
                </li>
                <li>
                  <a
                    data-cy="header-download-btn"
                    href="#"
                    className="ipha-download ipha-main"
                    title={`Download ${countryData.name} data`}
                    onClick={this.onDownloadClick.bind(null, {
                      country: this.props.match.params.name,
                    })}
                  >
                    Download
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <figure
            className="inpage__media inpage__media--cover media"
            data-cy="header-cover-img"
          >
            <div className="media__item">
              <img
                src="/assets/graphics/content/view--home/cover--home.jpg"
                alt="Cover image"
                width="1440"
                height="712"
              />
            </div>
          </figure>
        </header>

        <div className="inpage__body">
          {this.renderMap()}
          {this.renderCountryList()}
        </div>
      </section>
    );
  },
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,

    latestMeasurements: state.latestMeasurements,
    locations: state.locations,
  };
}

function dispatcher(dispatch) {
  return {
    _fetchLocations: (...args) => dispatch(fetchLocations(...args)),
    _fetchLatestMeasurements: (...args) =>
      dispatch(fetchLatestMeasurements(...args)),
    _invalidateAllLocationData: (...args) =>
      dispatch(invalidateAllLocationData(...args)),

    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Country);