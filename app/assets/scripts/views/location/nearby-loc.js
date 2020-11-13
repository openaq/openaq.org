import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';

import { generateLegendStops } from '../../utils/colors';
import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import MapComponent from '../../components/map';

export default function NearbyLoc({
  countryData,
  latestMeasurements,
  loc,
  parameters,
  sources,
}) {
  let {
    fetched,
    fetching,
    error,
    data: { results: locMeasurements },
  } = latestMeasurements;
  if (!fetched && !fetching) {
    return null;
  }

  const country = countryData || {};

  let intro = null;
  let content = null;

  if (fetching) {
    intro = <LoadingMessage />;
  } else if (error) {
    intro = <p>We couldn't get any nearby locations.</p>;
    content = (
      <InfoMessage>
        <p>Please try again later.</p>
        <p>
          If you think there's a problem, please{' '}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            contact us.
          </a>
        </p>
      </InfoMessage>
    );
  } else {
    let addIntro = null;
    if (loc.data.coordinates) {
      const scaleStops = generateLegendStops('pm25');
      const colorWidth = 100 / scaleStops.length;

      // Gentle nudge to ensure the popup is visible.
      let lat = loc.data.coordinates.latitude - 0.15;

      content = (
        <MapComponent
          center={[loc.data.coordinates.longitude, lat]}
          zoom={9}
          highlightLoc={loc.data.location}
          measurements={locMeasurements}
          parameter={_.find(parameters, { id: 'pm25' })}
          sources={sources}
          disableScrollZoom
        >
          <div>
            <p>Showing most recent values for PM2.5</p>
            <ul className="color-scale">
              {scaleStops.map(o => (
                <li
                  key={o.label}
                  style={{ backgroundColor: o.color, width: `${colorWidth}%` }}
                  className="color-scale__item"
                >
                  <span className="color-scale__value">{o.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </MapComponent>
      );
    } else {
      content = null;
      addIntro = `However we can't show a map for ${loc.data.location} because there's no geographical information.`;
    }

    if (locMeasurements.length === 1) {
      intro = (
        <p>
          There are no other locations in {loc.data.city}, {country.name}.{' '}
          {addIntro ? <br /> : null}
          {addIntro}
        </p>
      );
    } else {
      intro = (
        <p>
          There are <strong>{locMeasurements.length - 1}</strong> other
          locations in <strong>{loc.data.city}</strong>,{' '}
          <strong>{country.name}</strong>.{addIntro ? <br /> : null}
          {addIntro}
        </p>
      );
    }
  }

  return (
    <section className="fold" id="location-fold-nearby">
      <div className="inner">
        <header className="fold__header">
          <h1 className="fold__title">Nearby locations</h1>
          <div className="fold__introduction prose prose--responsive">
            {intro}
          </div>
        </header>
        {content ? <div className="fold__body">{content}</div> : null}
      </div>
    </section>
  );
}

NearbyLoc.propTypes = {
  sources: T.array,
  parameters: T.array,
  countryData: T.object,

  loc: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),

  latestMeasurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
