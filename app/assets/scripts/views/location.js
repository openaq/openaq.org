'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import c from 'classnames';
import { Link, hashHistory } from 'react-router';
import * as d3 from 'd3';
import { Dropdown } from 'openaq-design-system';

import { formatThousands } from '../utils/format';
import {
  fetchLocationIfNeeded,
  fetchLatestMeasurements,
  fetchMeasurements,
  invalidateAllLocationData,
  openDownloadModal
} from '../actions/action-creators';
import { generateLegendStops } from '../utils/colors';
import HeaderMessage from '../components/header-message';
import InfoMessage from '../components/info-message';
import LoadingMessage from '../components/loading-message';
import MapComponent from '../components/map';
import ShareBtn from '../components/share-btn';
import ChartMeasurement from '../components/chart-measurement';

var Location = React.createClass({
  displayName: 'Location',

  propTypes: {
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    _fetchLocationIfNeeded: React.PropTypes.func,
    _fetchLocations: React.PropTypes.func,
    _fetchLatestMeasurements: React.PropTypes.func,
    _fetchMeasurements: React.PropTypes.func,
    _invalidateAllLocationData: React.PropTypes.func,
    _openDownloadModal: React.PropTypes.func,

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

  getInitialState: function () {
    return {
      modalDownloadOpen: false
    };
  },

  shouldFetchData: function (prevProps) {
    let prevLoc = prevProps.params.name;
    let currLoc = this.props.params.name;

    return prevLoc !== currLoc;
  },

  getActiveParameterData: function () {
    let parameter = this.props.location.query.parameter;
    let parameterData = _.find(this.props.parameters, {id: parameter});
    return parameterData || _.find(this.props.parameters, {id: 'pm25'});
  },

  //
  // Start event listeners
  //

  onFilterSelect: function (parameter, e) {
    e.preventDefault();

    hashHistory.push(`/location/${this.props.params.name}?parameter=${parameter}`);
  },

  onDownloadClick: function () {
    let d = this.props.loc.data;
    this.props._openDownloadModal({
      country: d.country,
      area: d.city,
      location: d.location
    });
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
      this.props._fetchLatestMeasurements({city: loc.city, has_geo: 'true'});
      this.props._fetchMeasurements(loc.location, fromDate.toISOString(), toDate.toISOString());
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
      content = <LoadingMessage />;
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
              <dd>{formatThousands(measurements.meta.totalMeasurements)}</dd>
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
      intro = <LoadingMessage />;
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
        const scaleStops = generateLegendStops('pm25');
        const colorWidth = 100 / scaleStops.length;

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
                {scaleStops.map(o => (
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

  renderParameterSelector: function () {
    let activeParam = this.getActiveParameterData();
    let drop = (
      <Dropdown
        triggerElement='button'
        triggerClassName='button button--base-unbounded drop__toggle--caret'
        triggerTitle='Show/hide parameter options'
        triggerText={activeParam.name} >

        <ul role='menu' className='drop__menu drop__menu--select'>
        {this.props.parameters.map(o => (
          <li key={o.id}>
            <a className={c('drop__menu-item', {'drop__menu-item--active': activeParam.id === o.id})} href='#' title={`Show values for ${o.name}`} data-hook='dropdown:close' onClick={this.onFilterSelect.bind(null, o.id)}><span>{o.name}</span></a>
          </li>
        ))}
        </ul>
      </Dropdown>
    );

    return (
      <p>Showing {drop} values over last week.</p>
    );
  },

  renderMeasurementsChart: function () {
    let measurements = this.props.measurements.data.results;
    let activeParam = this.getActiveParameterData();
    // All the times are local and shouldn't be converted to UTC.
    // The values should be compared at the same time local to ensure an
    // accurate comparison.
    let userNow = moment().format('YYYY/MM/DD HH:mm:ss');
    let weekAgo = moment().subtract(7, 'days').format('YYYY/MM/DD HH:mm:ss');

    const filterFn = (o) => {
      if (o.parameter !== this.getActiveParameterData().id) {
        return false;
      }
      if (o.value < 0) return false;
      let localDate = moment.parseZone(o.date.local).format('YYYY/MM/DD HH:mm:ss');
      return localDate >= weekAgo && localDate <= userNow;
    };

    // Prepare data.
    let chartData = _.cloneDeep(measurements)
      .filter(filterFn)
      .map(o => {
        // Disregard timezone on local date.
        let dt = o.date.local.match(/^[0-9]{4}(?:-[0-9]{2}){2}T[0-9]{2}(?::[0-9]{2}){2}/)[0];
        // `measurement` local date converted directly to user local.
        o.date.localNoTZ = new Date(dt);
        return o;
      });

    let yMax = d3.max(chartData, o => o.value) || 0;

    // 1 Week.
    let xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

    if (!chartData.length) {
      return (
        <InfoMessage>
          <p>There's no data for the selected parameter</p>
          <p>Maybe you'd like to suggest a <a href='#' title='Suggest a new source'>new source</a>.</p>
        </InfoMessage>
      );
    }

    return (
      <ChartMeasurement
        className='location-measurement-chart'
        data={[chartData]}
        xRange={xRange}
        yRange={[0, yMax]}
        yLabel={`Values in ${activeParam.preferredUnit}`} />
    );
  },

  renderValuesBreakdown: function () {
    const {fetched, fetching, error} = this.props.measurements;

    if (!fetched && !fetching) {
      return null;
    }

    let intro = null;
    let content = null;

    if (fetching) {
      intro = <LoadingMessage />;
    } else if (error) {
      intro = <p>We couldn't get any data.</p>;
      content = (
        <InfoMessage>
          <p>Please try again later.</p>
          <p>If you think there's a problem <a href='#' title='Contact openaq'>contact us.</a></p>
        </InfoMessage>
      );
    } else {
      intro = this.renderParameterSelector();
      content = this.renderMeasurementsChart();
    }

    return (
      <section className='fold'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Values breakdown</h1>
            <div className='fold__introduction'>
              {intro}
            </div>
          </header>
          <div className='fold__body'>
            {content}
          </div>
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
                <li><button type='button' title='Download data for this location' className='button-inpage-download' onClick={this.onDownloadClick}>Download</button></li>
                <li><Link to={`/compare/${data.location}`} title='Compare location with another' className='button button--primary button--medium'>Compare</Link></li>
              </ul>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          {this.renderStatsInfo()}
          {this.renderSourceInfo()}
          {this.renderValuesBreakdown()}
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
    _invalidateAllLocationData: (...args) => dispatch(invalidateAllLocationData(...args)),

    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args))
  };
}

module.exports = connect(selector, dispatcher)(Location);
