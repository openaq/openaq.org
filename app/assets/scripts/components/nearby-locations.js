'use strict';
import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import LocationCard from './location-card';
import InfoMessage from './info-message';
import LoadingMessage from './loading-message';

var NearbyLocations = React.createClass({
  displayName: 'NearbyLocations',

  propTypes: {
    _geolocateUser: React.PropTypes.func,
    _fetchNearbyLocations: React.PropTypes.func,
    _openDownloadModal: React.PropTypes.func,
    geolocationRequesting: React.PropTypes.bool,
    geolocationRequested: React.PropTypes.bool,
    geolocationError: React.PropTypes.string,
    geolocationCoords: React.PropTypes.object,

    locFetching: React.PropTypes.bool,
    locFetched: React.PropTypes.bool,
    locError: React.PropTypes.string,
    locations: React.PropTypes.array,

    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array
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
      let sourceData = _.find(this.props.sources, {name: o.sourceName});
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
              sourceData={sourceData}
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
          <p>If you think there's a problem <a href='#' title='Contact openaq'>contact us.</a></p>
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
            <p>If you think there's a problem <a href='#' title='Contact openaq'>contact us.</a></p>
          </InfoMessage>
        );
      } else if (!this.props.locations.length) {
        intro = <p>There are <strong>0 sites</strong> located within a <strong>5km</strong> radius of your location.</p>;
        content = (
          <InfoMessage>
            <p>We're sorry, there's currently no data available in your area.</p>
            <p>Suggest a <a href='#' title='Suggest a new source'>new source</a> or <a href='#' title='Contact openaq'>let us know</a> what location you'd like to see data for.</p>
          </InfoMessage>
        );
      } else {
        let l = this.props.locations.length;
        if (l === 1) {
          intro = <p>There is <strong>1 site</strong> located within a <strong>5km</strong> radius of your location.</p>;
        } else {
          intro = <p>There are <strong>{Math.min(this.props.locations.length, 3)} sites</strong> located within a <strong>5km</strong> radius of your location.</p>;
        }
        content = this.renderNearby();
      }
    }

    return (
      <section className='fold' id='home-nearby'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Nearby locations</h1>
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
