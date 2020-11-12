import React, { useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import qs from 'qs';
import moment from 'moment';
import { Link } from 'react-router-dom';

import config from '../../config';
import {
  fetchLocationIfNeeded,
  fetchLatestMeasurements,
  fetchMeasurements,
  invalidateAllLocationData,
  openDownloadModal
} from '../../actions/action-creators';
import HeaderMessage from '../../components/header-message';
import StatsInfo from './stats-info';
import Metadata from './metadata';
import SourceInfo from './source-info';
import ValuesBreakdown from './values-breakdown';
import NearbyLoc from './nearby-loc';

function Location (props) {
  const query = qs.parse(props.location.search);
  const { name } = props.match.params;

  useEffect(() => {
    // Invalidate all the data related to the location page.
    // This is needed otherwise the system thinks there's data and
    // throws errors.
    props._invalidateAllLocationData();
    props._fetchLocationIfNeeded(name);
    return () => {
      props._invalidateAllLocationData();
    };
  }, [name]);

  useEffect(() => {
    // TODO: this needs more refactoring!
    if (
      props.loc.fetched &&
      !props.loc.fetching &&
      !props.latestMeasurements.fetched &&
      !props.latestMeasurements.fetching &&
      !props.measurements.fetched &&
      !props.measurements.fetching
    ) {
      let loc = props.loc.data;
      // Get the measurements.
      let toDate = moment.utc();
      let fromDate = toDate.clone().subtract(8, 'days');
      // props._fetchLatestMeasurements({city: loc.city, has_geo: 'true'});
      if (loc.coordinates) {
        props._fetchLatestMeasurements({
          coordinates: `${loc.coordinates.latitude},${loc.coordinates.longitude}`,
          radius: 10 * 1000, // 10 Km
          has_geo: 'true'
        });
      } else {
        props._fetchLatestMeasurements({
          location: loc.location
        });
      }
      props._fetchMeasurements(
        loc.location,
        fromDate.toISOString(),
        toDate.toISOString()
      );
    }
  });

  function getActiveParameterData () {
    let parameterData = _.find(props.parameters, { id: query.parameter });
    return parameterData || _.find(props.parameters, { id: 'pm25' });
  }

  function onFilterSelect (parameter) {
    props.history.push(
      `/location/${encodeURIComponent(name)}?parameter=${parameter}`
    );
  }

  function onDownloadClick () {
    let d = props.loc.data;
    props._openDownloadModal({
      country: d.country,
      area: d.city,
      location: d.location
    });
  }

  const { countryData } = props;
  let { fetched, fetching, error, data } = props.loc;
  if (!fetched && !fetching) {
    return null;
  }

  const country = countryData || {};

  if (fetching) {
    return (
      <HeaderMessage>
        <h1>Take a deep breath.</h1>
        <div className="prose prose--responsive">
          <p>Location data is loading...</p>
        </div>
      </HeaderMessage>
    );
  }

  if (error) {
    return (
      <HeaderMessage>
        <h1>Uh oh, something went wrong.</h1>
        <div className="prose prose--responsive">
          <p>
            There was a problem getting the data. If you continue to have
            problems, please let us know.
          </p>
          <p>
            <a href="mailto:info@openaq.org" title="Send us an email">
              Send us an Email
            </a>
          </p>
        </div>
      </HeaderMessage>
    );
  }

  return (
    <section className="inpage">
      <header className="inpage__header">
        <div className="inner">
          <div className="inpage__headline">
            <p className="inpage__subtitle">location</p>
            <h1 className="inpage__title">
              {data.location}{' '}
              <small>
                in {data.city}, {country.name}
              </small>
            </h1>
            <ul className="ipha">
              <li>
                <a
                  href={`${config.api}/locations?location=${data.location}`}
                  title="View in API documentation"
                  className="ipha-api"
                  target="_blank"
                >
                  View API
                </a>
              </li>
              <li>
                <button
                  type="button"
                  title="Download data for this location"
                  className="ipha-download"
                  onClick={onDownloadClick}
                >
                  Download
                </button>
              </li>
              <li>
                <Link
                  to={`/compare/${encodeURIComponent(data.location)}`}
                  title="Compare location with another"
                  className="ipha-compare ipha-main"
                >
                  <span>Compare</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <figure className="inpage__media inpage__media--cover media">
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
        <StatsInfo
          latestMeasurements={props.latestMeasurements}
          measurements={props.measurements}
          loc={props.loc}
          parameters={props.parameters}
        />
        <Metadata loc={props.loc} />
        <SourceInfo
          sources={props.sources}
          measurements={props.measurements}
          loc={props.loc}
        />
        <ValuesBreakdown
          measurements={props.measurements}
          parameters={props.parameters}
          activeParam={getActiveParameterData()}
          onFilterSelect={onFilterSelect}
        />
        <NearbyLoc
          countryData={props.countryData}
          latestMeasurements={props.latestMeasurements}
          loc={props.loc}
          parameters={props.parameters}
          sources={props.sources}
        />
      </div>
    </section>
  );
}

Location.propTypes = {
  match: T.object,
  location: T.object,

  _fetchLocationIfNeeded: T.func,
  _fetchLocations: T.func,
  _fetchLatestMeasurements: T.func,
  _fetchMeasurements: T.func,
  _invalidateAllLocationData: T.func,
  _openDownloadModal: T.func,

  countries: T.array,
  sources: T.array,
  parameters: T.array,

  countryData: T.object,

  loc: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object
  }),

  latestMeasurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object
  }),

  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object
  })
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,

    countryData: _.find(state.baseData.data.countries, {
      code: (state.location.data || {}).country
    }),

    loc: state.location,
    latestMeasurements: state.latestMeasurements,
    measurements: state.measurements
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLocationIfNeeded: (...args) =>
      dispatch(fetchLocationIfNeeded(...args)),
    _fetchLatestMeasurements: (...args) =>
      dispatch(fetchLatestMeasurements(...args)),
    _fetchMeasurements: (...args) => dispatch(fetchMeasurements(...args)),
    _invalidateAllLocationData: (...args) =>
      dispatch(invalidateAllLocationData(...args)),

    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args))
  };
}

export default connect(selector, dispatcher)(Location);
