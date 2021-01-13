import React from 'react';
import { PropTypes as T } from 'prop-types';

import Header from '.';

import config from '../../config';

export default function HubHeader(props) {
  return (
    <Header
      title={props.title}
      description={
        <>
          <p>
            Our repository of air quality data continues to grow and now
            includes low cost sensor data in addition to reference-grade data.
            Learn more about the data types here. Explore this data through
            search features on the site or through the API, where all real-time
            and historical data is now accessible.
          </p>
          <p>
            We are currently collecting data in {props.countriesCount} different
            countries and primarily aggregate PM2.5, PM10, ozone (O3), sulfur
            dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and
            black carbon (BC) measurements. In certain limited cases, additional
            pollutants outside of those standard set of pollutants are now
            available through low cost sensor sources.
          </p>
          <p>
            The low cost sensor addition to the platform is a pilot, let us know
            how you’re using it and give us feedback. If you cannot find the
            location you are looking for, please{' '}
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
            .
          </p>
        </>
      }
      disclaimer={true}
      action={{ api: config.apiDocs }}
    />
  );
}

HubHeader.propTypes = {
  title: T.string,
  countriesCount: T.number,
};
