import React from 'react';
import { connect } from 'react-redux';

import { fetchLatestMeasurements } from '../../actions/action-creators';

import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import { getCountryBbox } from '../../utils/countries';

// import MeasurementsLayer from '../../components/map/measurements-layer';
// import Legend from '../../components/map/legend';

function Map(props) {
  let { fetched, fetching, error } = props.latestMeasurements;

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

  const bbox = getCountryBbox(this.props.match.params.name);

  console.log;
  return (
    <section className="fold" id="country-fold-map" data-cy="country-map">
      <div className="fold__body">
        {/* <MapComponent bbox={bbox}>
          <MeasurementsLayer activeParameter={'pm25'} />
          <Legend parameters={this.props.parameters} activeParameter={'pm25'} />
        </MapComponent> */}
        <span> map</span>
      </div>
    </section>
  );
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    latestMeasurements: state.latestMeasurements,
  };
}

function dispatcher(dispatch) {
  return {
    _fetchLatestMeasurements: (...args) =>
      dispatch(fetchLatestMeasurements(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Map);
