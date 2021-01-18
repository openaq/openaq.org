import React from 'react';
import { PropTypes as T } from 'prop-types';

import Header from '.';

import config from '../../config';

export default function HubHeader(props) {
  return (
    <Header
      tagline="Air Quality Data by"
      title={props.title}
      description={
        <>
          <p>
            Our repository of air quality now includes low cost sensor data as a
            pilot, in addition to reference-grade data. Learn more about the
            data types here. Explore this data through the site or through the
            API, where all real-time and historical data is now accessible.
          </p>

          <p>
            We are currently collecting data in {props.countriesCount} different
            countries and primarily aggregate PM2.5, PM10, ozone (O3), sulfur
            dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and
            black carbon (BC) measurements. Additional pollutants outside of
            those standard set of pollutants are now available through low cost
            sensor sources at certain locations. If you cannot find the location
            you are looking for, please{' '}
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
          {props.title === 'Dataset' && (
            <p>
              This page groups data from monitoring locations that form a sensor
              network where common sensor systems are managed by the same source
              and share standardized deployment practices, data post-processing
              and quality assurance, that has been documented in related
              metadata. Datasets allow for additional exploration of air quality
              across comparable locations within the same network. Navigate to a
              specific dataset&apos;s page to view measurements and find
              technical information on collection methods. Datasets are part of
              a pilot to incorporate low cost sensor data into the platform. Let
              us know how you are using datasets and give us feedback.
            </p>
          )}
        </>
      }
      disclaimer
      feedback
      action={{ api: config.apiDocs }}
    />
  );
}

HubHeader.propTypes = {
  title: T.string,
  countriesCount: T.oneOfType([T.number, T.string]),
};
