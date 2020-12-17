import React from 'react';
import { connect } from 'react-redux';

import { fetchLatestMeasurements } from '../../actions/action-creators';

import InfoMessage from '../../components/info-message';
import LoadingMessage from '../../components/loading-message';
import { getCountryBbox } from '../../utils/countries';
import { generateLegendStops } from '../../utils/colors';

function Map(props) {
  let {
    fetched,
    fetching,
    error,
    data: { results },
  } = props.latestMeasurements;

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingMessage />;
  }

  if (error) {
    return <InfoMessage standardMessage />;
  }

  const scaleStops = generateLegendStops('pm25');
  const colorWidth = 100 / scaleStops.length;
  const bbox = getCountryBbox(props.match.params.name);

  return (
    <section className="fold" id="country-fold-map" data-cy="country-map">
      <div className="fold__body">
        <MapComponent
          bbox={bbox}
          zoom={1}
          measurements={results}
          parameter={_.find(props.parameters, { id: 'pm25' })}
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
