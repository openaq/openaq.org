import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { formatThousands } from '../../utils/format';
import {
  fetchLocations,
  invalidateAllLocationData,
  fetchLatestMeasurements,
  openDownloadModal,
} from '../../actions/action-creators';

import HeaderMessage from '../../components/header-message';
import Header from '../../components/header';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

export default function Country(props) {
  const { id } = props.match.params;
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    setState(state => ({ ...state, fetching: true, error: null }));

    return () => {
      setState(defaultState);
    };
  }, []);

  if (!fetched && !fetching) {
    return null;
  }

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

  if (error || !data) {
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

  function onDownloadClick() {
    props._openDownloadModal({
      country: data.country,
      area: data.city,
      location: data.location,
    });
  }

  return (
    <section className="inpage">
      <Header
        tagline="Country"
        title={data.name}
        subtitle={`in ${data.city}, ${data.country}`}
        action={{
          api: `${config.api}/locations?location=${data.id}`,
          download: onDownloadClick,
        }}
      />
    </section>
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
