'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router';
import createReactClass from 'create-react-class';

import LocationCard from './location-card';
import InfoMessage from './info-message';
import LoadingMessage from './loading-message';
import { formatThousands } from '../utils/format';

var NearbyLocations = createReactClass({
  displayName: 'NearbyLocations',

  propTypes: {
    _geolocateUser: T.func,
    _fetchNearbyLocations: T.func,
    _openDownloadModal: T.func,
    geolocationRequesting: T.bool,
    geolocationRequested: T.bool,
    geolocationError: T.string,
    geolocationCoords: T.object,

    locFetching: T.bool,
    locFetched: T.bool,
    locError: T.string,
    locations: T.array,

    countries: T.array,
    sources: T.array,
    parameters: T.array
  },

  //
  // Start life-cycle methods
  //

  componentDidMount: function () {
    this.props._geolocateUser();
  },

  componentDidUpdate: function (prevProps) {
    let currC = this.props.geolocationCoords;
    let prevC = prevProps.geolocationCoords;
    if (currC.latitude !== prevC.latitude && currC.longitude !== prevC.longitude) {
      this.props._fetchNearbyLocations([currC.latitude, currC.longitude]);
    }
  },

  renderGettingLocation: function () {

  },

  renderNearby: function () {
    return this.props.locations.map(o => {
      let countryData = _.find(this.props.countries, {code: o.country});
      let sourcesData = o.sourceNames
        .map(s => _.find(this.props.sources, {name: s}))
        .filter(s => s);
      let params = o.parameters.map(o => _.find(this.props.parameters, {id: o}));
      let openModal = () => this.props._openDownloadModal({
        country: o.country,
        area: o.city,
        location: o.location
      });
      return <LocationCard
              onDownloadClick={openModal}
              key={o.location}
              compact
              name={o.location}
              city={o.city}
              countryData={countryData}
              sourcesData={sourcesData}
              totalMeasurements={o.count}
              parametersList={params}
              lastUpdate={o.lastUpdated}
              collectionStart={o.firstUpdated} />;
    });
  },

  render: function () {
    let {geolocationRequesting: requesting,
      geolocationRequested: requested,
      geolocationError: error} = this.props;

    if (!requested && !requesting) {
      return null;
    }

    let content = null;
    let intro = null;
    if (requesting) {
      content = <LoadingMessage><p>Determining your location</p></LoadingMessage>;
    }

    if (error) {
      intro = <p>We couldn't locate your position.</p>;
      content = (
        <InfoMessage>
          <p>Try enabling location services or using a different browser.</p>
          <p>If you think there's a problem <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
        </InfoMessage>
      );
    }

    // Position acquired. Verify status of locations.
    if (requested && !requesting && !error) {
      if (this.props.locFetching) {
        content = <LoadingMessage />;
      } else if (this.props.locError) {
        intro = <p>We couldn't get any nearby locations.</p>;
        content = (
          <InfoMessage>
            <p>Please try again later.</p>
            <p>If you think there's a problem <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
          </InfoMessage>
        );
      } else if (this.props.locations.length) {
        intro = <p>These are the <strong>3 sites</strong> closest to you.<br/><strong>{this.props.locations[0].location}</strong> is <strong>{formatThousands(this.props.locations[0].distance / 1000, 0)}km</strong> from your position.</p>;
        content = this.renderNearby();
      }
    }

    return (
      <section className='fold' id='home-nearby'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Nearest locations</h1>
            <div className='fold__introduction prose prose--responsive'>
              {intro}
            </div>
          </header>
          <div className='fold__body'>
            {content}
          </div>
          <div className='fold__footer'>
            <Link to='/locations' title='View all locations' className='button button--large button--primary-bounded button--semi-fluid'>View All Locations</Link>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = NearbyLocations;
