'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import c from 'classnames';

import { formatThousands } from '../utils/format';
import { fetchLocationIfNeeded, fetchLatestMeasurements, fetchMeasurements, invalidateAllLocationData } from '../actions/action-creators';
import { getMapColors } from '../utils/colors';
import HeaderMessage from '../components/header-message';
import InfoMessage from '../components/info-message';
import MapComponent from '../components/map';
import ShareBtn from '../components/share-btn';

var Location = React.createClass({
  displayName: 'Location',

  propTypes: {
    params: React.PropTypes.object,
    _fetchLocationIfNeeded: React.PropTypes.func,
    _fetchLocations: React.PropTypes.func,
    _fetchLatestMeasurements: React.PropTypes.func,
    _fetchMeasurements: React.PropTypes.func,
    _invalidateAllLocationData: React.PropTypes.func,

    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array,

    countryData: React.PropTypes.object,

    loc: React.PropTypes.shape({
      fetching: React.PropTypes.bool,
      fetched: React.PropTypes.bool,
      error: React.PropTypes.string,
      data: React.PropTypes.object
    }),

    latestMeasurements: React.PropTypes.shape({
      fetching: React.PropTypes.bool,
      fetched: React.PropTypes.bool,
      error: React.PropTypes.string,
      data: React.PropTypes.object
    }),

    measurements: React.PropTypes.shape({
      fetching: React.PropTypes.bool,
      fetched: React.PropTypes.bool,
      error: React.PropTypes.string,
      data: React.PropTypes.object
    })
  },

  shouldFetchData: function (prevProps) {
    let prevLoc = prevProps.params.name;
    let currLoc = this.props.params.name;

    return prevLoc !== currLoc;
  },

  //
  // Start life-cycle methods.
  //

  componentDidMount: function () {
    // Invalidate all the data related to the location page.
    // This is needed otherwise the system thinks there's data and
    // throws errors.
    this.props._invalidateAllLocationData();
    this.props._fetchLocationIfNeeded(this.props.params.name);
  },

  componentDidUpdate: function (prevProps) {
    this.shouldFetchData(prevProps) && this.props._fetchLocationIfNeeded(this.props.params.name);
    if (this.shouldFetchData(prevProps)) {
      // Invalidate all the data related to the location page.
      // This is needed otherwise the system thinks there's data and
      // throws errors.
      this.props._invalidateAllLocationData();
      this.props._fetchLocationIfNeeded(this.props.params.name);
      return;
    }

    if (this.props.loc.fetched && !this.props.loc.fetching &&
      !this.props.latestMeasurements.fetched && !this.props.latestMeasurements.fetching &&
      !this.props.measurements.fetched && !this.props.measurements.fetching) {
      let loc = this.props.loc.data;

      // Get the measurements.
      let toDate = moment.utc();
      let fromDate = toDate.clone().subtract(8, 'days');
      this.props._fetchLatestMeasurements({city: loc.city});
      this.props._fetchMeasurements(loc.location, fromDate, toDate);
    }
  },

  //
  // Start render methods.
  //

  renderStatsInfo: function () {
    const {fetched: lastMFetched, fetching: lastMFetching, error: lastMError, data: {results: lastMeasurements}} = this.props.latestMeasurements;
    const {fetched: mFetched, fetching: mFetching, error: mError, data: measurements} = this.props.measurements;

    const error = lastMError || mError;
    const fetched = lastMFetched || mFetched;
    const fetching = lastMFetching || mFetching;

    if (!fetched && !fetching) {
      return null;
    }

    let content = null;
    let intro = null;

    if (fetching) {
      content = <p>Fetching the data</p>;
    } else if (error) {
      intro = <p>We couldn't get stats.</p>;
      content = (
        <div className='fold__body'>
          <InfoMessage>
            <p>Please try again later.</p>
            <p>If you think there's a problem <a href='#' title='Contact openaq'>contact us.</a></p>
          </InfoMessage>
        </div>
      );
    } else {
      let locData = this.props.loc.data;

      let sDate = moment(locData.firstUpdated).format('YYYY/MM/DD');
      let eDate = moment(locData.lastUpdated).format('YYYY/MM/DD');

      let lng = ' --';
      let lat = ' --';
      if (locData.coordinates) {
        lng = Math.floor(locData.coordinates.longitude * 1000) / 1000;
        lat = Math.floor(locData.coordinates.latitude * 1000) / 1000;
      }

      // Get latest measurements for this location in particular.
      let locLastMeasurement = _.find(lastMeasurements, {location: locData.location});

      content = (
        <div className='fold__body'>
          <div className='col-main'>
            <dl>
              <dt>Measurements</dt>
              <dd>{formatThousands(measurements.meta.found)}</dd>
              <dt>Collection Dates</dt>
              <dd>{sDate} - {eDate}</dd>
              <dt>Coordinates</dt>
              <dd>N{lat}, E{lng}</dd>
            </dl>
          </div>
          <div className='col-sec'>
            <p className='heading-alt'>Latest Measurements:</p>
            <ul className='measurements-list'>
              {locLastMeasurement.measurements.map(o => {
                let param = _.find(this.props.parameters, {id: o.parameter});
                return <li key={o.parameter}><strong>{param.name}</strong>{o.value}{o.unit} at {moment(o.lastUpdated).format('YYYY/MM/DD HH:mm')}</li>;
              })}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <section className='fold' id='location-stats'>
        <div className='inner'>
          <header className={c('fold__header', {'visually-hidden': !error})}>
            <h1 className='fold__title'>Stats information</h1>
            <div className='fold__introduction prose prose--responsive'>
              {intro}
            </div>
          </header>
          {content}
        </div>
      </section>
    );
  },

  renderSourceInfo: function () {
    let source = _.find(this.props.sources, {name: this.props.loc.data.sourceName});

    return (
      <section className='fold fold--filled' id='location-source'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Source information</h1>
          </header>
          <div className='fold__body'>
            <div className='col-main'>
              <p>Source: <a href={source.sourceURL} title='View source information'>{source.name}</a></p>
            </div>
            <div className='col-sec'>
              {source.description
                ? <p>{source.description}</p>
                : null}
              For more information contact <a href={`mailto:${source.contacts[0]}`}>{source.contacts[0]}</a>.
            </div>
          </div>
        </div>
      </section>
    );
  },

  renderNearbyLoc: function () {
    let {fetched, fetching, error, data: {results: locMeasurements}} = this.props.latestMeasurements;
    if (!fetched && !fetching) {
      return null;
    }

    let intro = null;
    let content = null;

    if (fetching) {
      intro = <p>Fetching the data</p>;
    } else if (error) {
      intro = <p>We couldn't get any nearby locations.</p>;
      content = (
        <InfoMessage>
          <p>Please try again later.</p>
          <p>If you think there's a problem <a href='#' title='Contact openaq'>contact us.</a></p>
        </InfoMessage>
      );
    } else {
      let addIntro = null;
      if (this.props.loc.data.coordinates) {
        const mapColors = getMapColors();
        const colorWidth = 100 / mapColors.length;

        content = <MapComponent
          center={[this.props.loc.data.coordinates.longitude, this.props.loc.data.coordinates.latitude]}
          zoom={9}
          highlightLoc={this.props.loc.data.location}
          measurements={locMeasurements}
          parameter={_.find(this.props.parameters, {id: 'pm25'})}
          disableScrollZoom >
            <div>
              <p>Showing most recent values for PM2.5</p>
              <ul className='color-scale'>
                {mapColors.map(o => (
                  <li key={o.label} style={{'backgroundColor': o.color, width: `${colorWidth}%`}} className='color-scale__item'><span className='color-scale__value'>{o.label}</span></li>
                ))}
              </ul>
            </div>
          </MapComponent>;
      } else {
        content = null;
        addIntro = `However we can't show a map for ${this.props.loc.data.location} because there's no geographical information.`;
      }

      if (locMeasurements.length === 1) {
        intro = <p>There are no other locations in {this.props.loc.data.city}, {this.props.countryData.name}. {addIntro ? <br/> : null}{addIntro}</p>;
      } else {
        intro = <p>There are <strong>{locMeasurements.length - 1}</strong> other locations in <strong>{this.props.loc.data.city}</strong>, <strong>{this.props.countryData.name}</strong>.
          {addIntro ? <br/> : null}{addIntro}</p>;
      }
    }

    return (
      <section className='fold' id='location-nearby'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Nearby locations</h1>
            <div className='fold__introduction prose prose--responsive'>
              {intro}
            </div>
          </header>
          {content ? (
            <div className='fold__body'>
              {content}
            </div>
          ) : null}
        </div>
      </section>
    );
  },

  render: function () {
    let {fetched, fetching, error, data} = this.props.loc;
    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return (
        <HeaderMessage>
          <h2>Take a deep breath.</h2>
          <p>Location data is loading...</p>
        </HeaderMessage>
      );
    }

    if (error) {
      return (
        <HeaderMessage>
          <h2>Uhoh, something went wrong.</h2>
          <p>There was a problem getting the data. If the problem persists let us know.</p>
          <a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a>
        </HeaderMessage>
      );
    }

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{data.location} <small>in {data.city}, {this.props.countryData.name}</small></h1>
              <div className='inpage__headline-actions'>
                <ShareBtn />
              </div>
            </div>
            <div className='inpage__actions'>
              <ul>
                <li><a href='' title='View in api' className='button-inpage-api' target='_blank'>View API</a></li>
                <li><button type='button' title='Download data for this location' className='button-inpage-download'>Download</button></li>
                <li><a href='' title='Compare location with another' className='button button--primary button--medium'>Compare</a></li>
              </ul>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          {this.renderStatsInfo()}
          {this.renderSourceInfo()}

          <section className='fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Values breakdown</h1>
              </header>
              <div className='fold__body'>
                coming soon...
              </div>
            </div>
          </section>

          {this.renderNearbyLoc()}

        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,

    countryData: _.find(state.baseData.data.countries, {code: (state.location.data || {}).country}),

    loc: state.location,
    latestMeasurements: state.latestMeasurements,
    measurements: state.measurements
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLocationIfNeeded: (...args) => dispatch(fetchLocationIfNeeded(...args)),
    _fetchLatestMeasurements: (...args) => dispatch(fetchLatestMeasurements(...args)),
    _fetchMeasurements: (...args) => dispatch(fetchMeasurements(...args)),
    _invalidateAllLocationData: (...args) => dispatch(invalidateAllLocationData(...args))
  };
}

module.exports = connect(selector, dispatcher)(Location);
