'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import c from 'classnames';
import { Link, hashHistory } from 'react-router';
import * as d3 from 'd3';
import { Dropdown } from 'openaq-design-system';
import { schemas } from 'openaq-data-format';
import createReactClass from 'create-react-class';

import config from '../config';
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
import ChartMeasurement from '../components/chart-measurement';

const locationSchema = schemas.location;

var Location = createReactClass({
  displayName: 'Location',

  propTypes: {
    params: T.object,
    location: T.object,
    _fetchLocationIfNeeded: T.func,
    _fetchLocations: T.func,
    _fetchLatestMeasurements: T.func,
    _fetchMeasurements: T.func,
    _invalidateAllLocationData: T.func,
    _openDownloadModal: T.func,

    countries: T.array,
    sources: T.array,
    parameters: T.array,

    countryData: T.object,

    loc: T.shape({
      fetching: T.bool,
      fetched: T.bool,
      error: T.string,
      data: T.object
    }),

    latestMeasurements: T.shape({
      fetching: T.bool,
      fetched: T.bool,
      error: T.string,
      data: T.object
    }),

    measurements: T.shape({
      fetching: T.bool,
      fetched: T.bool,
      error: T.string,
      data: T.object
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

    hashHistory.push(`/location/${encodeURIComponent(this.props.params.name)}?parameter=${parameter}`);
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
      // this.props._fetchLatestMeasurements({city: loc.city, has_geo: 'true'});
      if (loc.coordinates) {
        this.props._fetchLatestMeasurements({
          coordinates: `${loc.coordinates.latitude},${loc.coordinates.longitude}`,
          radius: 10 * 1000, // 10 Km
          has_geo: 'true'
        });
      } else {
        this.props._fetchLatestMeasurements({
          location: loc.location
        });
      }
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
      intro = (
        <div className='fold__introduction prose prose--responsive'>
          <p>We couldn't get stats. Please try again later.</p>
          <p>If you think there's a problem, please <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
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
            <h2>Details</h2>
            <dl className='global-details-list'>
              <dt>Measurements</dt>
              <dd>{formatThousands(measurements.meta.totalMeasurements)}</dd>
              <dt>Collection Dates</dt>
              <dd>{sDate} - {eDate}</dd>
              <dt>Coordinates</dt>
              <dd>N{lat}, E{lng}</dd>
            </dl>
          </div>

          <div className='col-sec'>
            <h2>Latest measurements</h2>
            {locLastMeasurement ? (
              <dl className='global-details-list'>
                {locLastMeasurement.measurements.reduce((acc, o) => {
                  let param = _.find(this.props.parameters, {id: o.parameter});
                  return acc.concat([
                    <dt key={`dt-${o.parameter}`}>{param.name}</dt>,
                    <dd key={`dd-${o.parameter}`}>{o.value}{o.unit} at {moment(o.lastUpdated).format('YYYY/MM/DD HH:mm')}</dd>
                  ]);
                }, [])}
              </dl>
            ) : <p>N/A</p>}
          </div>
        </div>
      );
    }

    return (
      <section className='fold' id='location-fold-stats'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Stats</h1>
            {intro}
          </header>
          {content}
        </div>
      </section>
    );
  },

  renderMetadata: function () {
    const { loc, loc: { data: { metadata } } } = this.props;

    if (!metadata) return null;

    const exclude = [
      'id',
      'coordinates',
      'city',
      'country',
      'instruments',
      'parameters',
      'attribution'
    ];

    const allProperties = Object.keys(locationSchema.properties)
      .filter((key) => {
        return !exclude.includes(key) && metadata[key];
      });

    const propertiesMain = [];
    const propertiesSec = [];
    const length = Math.ceil(allProperties.length / 2);

    allProperties.forEach((key, i) => {
      const prop = locationSchema.properties[key];
      prop.key = key;
      let val = metadata[prop.key];

      if (prop.format && prop.format === 'date-time') {
        val = moment.utc(val).format('YYYY/MM/DD');
      }
      if (prop.type && prop.type === 'boolean') {
        val = val ? 'Yes' : 'No';
      }

      const sectionIndex = Math.floor(i / length);

      switch (sectionIndex) {
        case 0: {
          propertiesMain.push(<dt key={`${key}-${prop.title}`} className='metadata-detail-title'>{prop.title}</dt>);
          propertiesMain.push(<dd key={`${key}-${prop.title}-val`}>{val}</dd>);
          break;
        }
        case 1: {
          propertiesSec.push(<dt key={`${key}-${prop.title}`} className='metadata-detail-title'>{prop.title}</dt>);
          propertiesSec.push(<dd key={`${key}-${prop.title}-val`}>{val}</dd>);
          break;
        }
      }
    });

    return (
      <section className='fold' id='location-fold-metadata'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Metadata</h1>
          </header>
          <div className='fold__body'>
            <div className='col-main'>
              <dl className='global-details-list'>
                {propertiesMain}
              </dl>
            </div>
            <div className='col-sec'>
              <dl className='global-details-list'>
                {propertiesSec}
              </dl>
            </div>
          </div>
          <div className='update-metadata-callout'>
            <p>
              Have more information about this location? <a href={`${config.metadata}/location/${loc.data.id}`} title="Update the metadata">Update the metadata</a>
            </p>
          </div>
        </div>
      </section>
    );
  },

  renderSourceInfo: function () {
    const {data} = this.props.measurements;

    let sources = this.props.loc.data.sourceNames
      .map(o => _.find(this.props.sources, {name: o}))
      .filter(o => o);

    if (data.attribution) {
      // filtering attribution[0] b/c it kept showing up with same name and url as sources[0]
      let added = data.attribution.filter((src, index) => index !== 0);
      sources = [...sources, ...added];
    }

    return (
      <section className='fold' id='location-fold-source'>
        <div className='inner'>
          <header className=''>
            <h1 className='fold__title'>Sources</h1>
          </header>
          <div className='fold__body'>
            <div className='col-main'>
            <ul className='sources__list'>
              {sources.map(source =>
                <li key={source.name}>
                  <p>
                    {source.sourceURL || source.url
                      ? <a href={source.sourceURL || source.url}
                         title='View source information'>
                         {source.name} </a>
                      : source.name}
                  </p>
                </li>
              )}
            </ul>
            </div>
            {
              sources[0] && (
                <div className='col-sec'>
                  {sources[0].description ? <p>{sources[0].description}</p> : null}
                  For more information contact <a href={`mailto:${sources[0].contacts[0]}`} title={sources[0].contacts[0]}>{sources[0].contacts[0]}</a>.
                </div>
              )
            }
          </div>
        </div>
      </section>
    );
  },

  renderNearbyLoc: function () {
    const { countryData } = this.props;
    let {fetched, fetching, error, data: {results: locMeasurements}} = this.props.latestMeasurements;
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
          <p>If you think there's a problem, please <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
        </InfoMessage>
      );
    } else {
      let addIntro = null;
      if (this.props.loc.data.coordinates) {
        const scaleStops = generateLegendStops('pm25');
        const colorWidth = 100 / scaleStops.length;

        // Gentle nudge to ensure the popup is visible.
        let lat = this.props.loc.data.coordinates.latitude - 0.15;

        content = <MapComponent
          center={[this.props.loc.data.coordinates.longitude, lat]}
          zoom={9}
          highlightLoc={this.props.loc.data.location}
          measurements={locMeasurements}
          parameter={_.find(this.props.parameters, {id: 'pm25'})}
          sources={this.props.sources}
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
        intro = <p>There are no other locations in {this.props.loc.data.city}, {country.name}. {addIntro ? <br/> : null}{addIntro}</p>;
      } else {
        intro = <p>There are <strong>{locMeasurements.length - 1}</strong> other locations in <strong>{this.props.loc.data.city}</strong>, <strong>{country.name}</strong>.
          {addIntro ? <br/> : null}{addIntro}</p>;
      }
    }

    return (
      <section className='fold' id='location-fold-nearby'>
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
        // We have to use moment instead of new Date() because the behavior
        // is not consistent across browsers.
        // Firefox interprets the string as being in the current timezone
        // while chrome interprets it as being utc. So:
        // Date: 2016-08-25T14:00:00
        // Firefox result: Thu Aug 25 2016 14:00:00 GMT-0400 (EDT)
        // Chrome result: Thu Aug 25 2016 10:00:00 GMT-0400 (EDT)
        o.date.localNoTZ = moment(dt).toDate();
        return o;
      });

    let yMax = d3.max(chartData, o => o.value) || 0;

    // 1 Week.
    let xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

    if (!chartData.length) {
      return (
        <InfoMessage>
          <p>There are no data for the selected parameter.</p>
          <p>Maybe you'd like to suggest a <a href='https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform' title='Suggest a new source'>new source</a>.</p>
        </InfoMessage>
      );
    }

    return (
      <ChartMeasurement
        className='location-measurement-chart'
        data={[chartData]}
        xRange={xRange}
        yRange={[0, yMax]}
        yLabel={activeParam.preferredUnit} />
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
          <p>If you think there's a problem, please <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
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
    const { countryData } = this.props;
    let {fetched, fetching, error, data} = this.props.loc;
    if (!fetched && !fetching) {
      return null;
    }

    const country = countryData || {};

    if (fetching) {
      return (
        <HeaderMessage>
          <h1>Take a deep breath.</h1>
          <div className='prose prose--responsive'>
            <p>Location data is loading...</p>
          </div>
        </HeaderMessage>
      );
    }

    if (error) {
      return (
        <HeaderMessage>
          <h1>Uh oh, something went wrong.</h1>
          <div className='prose prose--responsive'>
            <p>There was a problem getting the data. If you continue to have problems, please let us know.</p>
            <p><a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a></p>
          </div>
        </HeaderMessage>
      );
    }
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <p className='inpage__subtitle'>location</p>
              <h1 className='inpage__title'>{data.location} <small>in {data.city}, {country.name}</small></h1>
              <ul className='ipha'>
                <li><a href={`${config.api}/locations?location=${data.location}`} title='View in API documentation' className='ipha-api' target='_blank'>View API</a></li>
                <li><button type='button' title='Download data for this location' className='ipha-download' onClick={this.onDownloadClick}>Download</button></li>
                <li><Link to={`/compare/${encodeURIComponent(data.location)}`} title='Compare location with another' className='ipha-compare ipha-main'><span>Compare</span></Link></li>
              </ul>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--home/cover--home.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>
          {this.renderStatsInfo()}
          {this.renderMetadata()}
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
