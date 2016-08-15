'use strict';
import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import { hashHistory } from 'react-router';
import { Dropdown } from 'openaq-design-system';
import * as d3 from 'd3';

import {
  fetchCompareLocationIfNeeded,
  removeCompareLocation,
  selectCompareOptions,
  cancelCompareOptions,
  selectCompareCountry,
  selectCompareArea,
  selectCompareLocation,
  fetchLocations,
  invalidateLocations,
  fetchCompareLocationMeasurements,
  invalidateCompare
} from '../actions/action-creators';
import ShareBtn from '../components/share-btn';
import LoadingMessage from '../components/loading-message';
import InfoMessage from '../components/info-message';
import ChartBrush from '../components/chart-brush';
import { convertParamIfNeeded } from '../utils/map-settings';

var Compare = React.createClass({
  displayName: 'Compare',

  propTypes: {
    _fetchCompareLocationIfNeeded: React.PropTypes.func,
    _removeCompareLocation: React.PropTypes.func,
    _selectCompareOptions: React.PropTypes.func,
    _cancelCompareOptions: React.PropTypes.func,
    _selectCompareCountry: React.PropTypes.func,
    _selectCompareArea: React.PropTypes.func,
    _selectCompareLocation: React.PropTypes.func,
    _fetchLocations: React.PropTypes.func,
    _invalidateLocations: React.PropTypes.func,
    _invalidateCompare: React.PropTypes.func,
    _fetchCompareLocationMeasurements: React.PropTypes.func,

    params: React.PropTypes.object,
    location: React.PropTypes.object,

    countries: React.PropTypes.array,
    parameters: React.PropTypes.array,

    compareLoc: React.PropTypes.array,
    compareMeasurements: React.PropTypes.array,
    compareSelectOpts: React.PropTypes.object,

    locations: React.PropTypes.object
  },

  getActiveParameterData: function () {
    let parameter = this.props.location.query.parameter;
    let parameterData = _.find(this.props.parameters, {id: parameter});
    return parameterData || _.find(this.props.parameters, {id: 'pm25'});
  },

  fetchLocationData: function (index, loc) {
    this.props._fetchCompareLocationIfNeeded(index, loc);

    let toDate = moment.utc();
    let fromDate = toDate.clone().subtract(8, 'days');
    this.props._fetchCompareLocationMeasurements(index, loc, fromDate.toISOString(), toDate.toISOString());
  },

  // Returns an array with the names of the locations being compared.
  // It also accepts a filter function to further remove locations.
  // Mostly used to construct the url.
  getLocNames: function (filter) {
    return this.props.compareLoc
      .filter((o, i) => {
        if (!o.data) return false;
        if (filter) return filter(o, i);
        return true;
      })
      .map(o => o.data.location);
  },

  //
  // Start event listeners
  //

  onFilterSelect: function (parameter, e) {
    e.preventDefault();
    let locsUrl = this.getLocNames()
      .join('/');

    hashHistory.push(`/compare/${locsUrl}?parameter=${parameter}`);
  },

  removeLocClick: function (index, e) {
    // To build the url filter out the location at the given index.
    // Ensure that non loaded locations are also out.
    let locsUrl = this.getLocNames((o, i) => i !== index)
      .join('/');

    hashHistory.push(`/compare/${locsUrl}?parameter=${this.getActiveParameterData().id}`);
  },

  onCompareOptSelect: function (key, e) {
    switch (key) {
      case 'country':
        this.props._invalidateLocations();
        this.props._selectCompareCountry(e.target.value);
        this.props._fetchLocations(1, {country: e.target.value}, 1000);
        break;
      case 'area':
        this.props._selectCompareArea(e.target.value);
        break;
      case 'location':
        this.props._selectCompareLocation(e.target.value);
        break;
    }
  },

  compareOptionsConfirmClick: function () {
    this.props._cancelCompareOptions();

    let locsUrl = this.getLocNames();
    locsUrl.push(this.props.compareSelectOpts.location);

    hashHistory.push(`/compare/${locsUrl.join('/')}?parameter=${this.getActiveParameterData().id}`);
  },

  //
  // Start life-cycle methods.
  //

  componentDidMount: function () {
    this.props._invalidateCompare();
    let {loc1, loc2, loc3} = this.props.params;
    loc1 && this.fetchLocationData(0, loc1);
    loc2 && this.fetchLocationData(1, loc2);
    loc3 && this.fetchLocationData(2, loc3);
  },

  componentWillReceiveProps: function (nextProps) {
    let {loc1: prevLoc1, loc2: prevLoc2, loc3: prevLoc3} = this.props.params;
    let {loc1: currLoc1, loc2: currLoc2, loc3: currLoc3} = nextProps.params;

    if (prevLoc1 !== currLoc1) {
      currLoc1
        ? this.fetchLocationData(0, currLoc1)
        : this.props._removeCompareLocation(0);
    }
    if (prevLoc2 !== currLoc2) {
      currLoc2
        ? this.fetchLocationData(1, currLoc2)
        : this.props._removeCompareLocation(1);
    }
    if (prevLoc3 !== currLoc3) {
      currLoc3
        ? this.fetchLocationData(2, currLoc3)
        : this.props._removeCompareLocation(2);
    }
  },

  //
  // Start render methods.
  //

  renderCompareSelectOpts: function () {
    if (this.props.compareSelectOpts.status === 'none') {
      return (
        <li className='compare__location compare__location--actions' key='actions'>
          <button type='button' className='button-compare-location' onClick={this.props._selectCompareOptions}>Add Location</button>
        </li>
      );
    } else if (this.props.compareSelectOpts.status === 'selecting') {
      let {fetching: fetchingLocations, fetched: fetchedLocations, data: {results: locations}} = this.props.locations;

      // Mental Sanity note: we use area to designate the broader region where a sensor
      // is while the API call it city.
      // Areas and Locations belonging to the selected country.
      // Will be filtered from the this.props.locations;
      let compareAreas = [];
      let compareLocations = [];

      if (locations) {
        compareAreas = _(locations)
          .filter(o => o.country === this.props.compareSelectOpts.country)
          .uniqBy('city')
          .sortBy('city')
          .value();

        if (locations && this.props.compareSelectOpts.area !== '--') {
          compareLocations = _(locations)
            .filter(o => {
              // Has to belong to the correct area and can't have been selected before.
              return o.city === this.props.compareSelectOpts.area &&
                o.location !== this.props.params.loc1 &&
                o.location !== this.props.params.loc2;
            })
            .uniqBy('location')
            .sortBy('location')
            .value();
        }
      }

      let compareAreasLabel = fetchingLocations ? 'Loading Data' : 'Select an Area';
      let compareLocationsLabel = fetchingLocations ? 'Loading Data' : (compareLocations.length ? 'Select a Location' : 'No locations available');

      // Disable area while the locations are not fetched.
      let disableArea = !fetchedLocations || fetchingLocations;
      // Disable locations if locations are not fetched or are not selected
      let disableLocation = disableArea || this.props.compareSelectOpts.area === '--' || !compareLocations.length;
      // Disable confirm until everything is selected.
      let disableConfirm = disableLocation || this.props.compareSelectOpts.location === '--';

      return (
        <li className='compare__location compare__location--actions' key='actions-form'>
          <h2>Choose Location</h2>
          <form>
            <div className='form__group'>
              <label htmlFor='loc-country' className='form__label'>Country</label>
              <select id='loc-country' className='form__control form__control--small' value={this.props.compareSelectOpts.country} onChange={this.onCompareOptSelect.bind(null, 'country')}>
                <option value='--'>Select a country</option>
                {this.props.countries.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
              </select>
            </div>
            <div className={c('form__group', {disabled: disableArea})}>
              <label htmlFor='loc-area' className='form__label'>Area</label>
              <select id='loc-area' className='form__control form__control--small' value={this.props.compareSelectOpts.area} onChange={this.onCompareOptSelect.bind(null, 'area')}>
                <option value='--'>{compareAreasLabel}</option>
                {compareAreas.map(o => <option key={o.city} value={o.city}>{o.city}</option>)}
              </select>
            </div>
            <div className={c('form__group', {disabled: disableLocation})}>
              <label htmlFor='loc-location' className='form__label'>Location</label>
              <select id='loc-location' className='form__control form__control--small' value={this.props.compareSelectOpts.location} onChange={this.onCompareOptSelect.bind(null, 'location')}>
                <option value='--'>{compareLocationsLabel}</option>
                {compareLocations.map(o => <option key={o.location} value={o.location}>{o.location}</option>)}
              </select>
            </div>
            <div className='form__actions'>
              <button type='button' className='button button--small button--base' onClick={this.props._cancelCompareOptions}>Cancel</button>
              <button type='button' className={c('button button--small button--primary', {disabled: disableConfirm})} onClick={this.compareOptionsConfirmClick}>Confirm</button>
            </div>
          </form>
        </li>
      );
    }
  },

  renderCompareLocations: function () {
    let locs = this.props.compareLoc.filter(o => o.fetched || o.fetching);

    let locsEl = locs.map((o, i) => {
      if (o.fetching) {
        return (
          <li className='compare__location' key={i}>
            <LoadingMessage type='minimal'/>
          </li>
        );
      }

      let d = o.data;
      let kl = ['compare-marker--st', 'compare-marker--nd', 'compare-marker--rd'];
      let updated = moment(d.lastUpdated).fromNow();
      let countryData = _.find(this.props.countries, {code: d.country});
      return (
        <li className='compare__location' key={d.location}>
          <p className='compare__subtitle'>Updated {updated}</p>
          <h2 className='compare__title'><span className={c('compare-marker', kl[i])}>{d.location}</span> <small>in {d.city}, {countryData.name}</small></h2>
          <div className='compare__actions'>
            { /* <button type='button' className='button button--small button--primary-unbounded'>Edit</button> */ }
            <button type='button' className='button button--small button--primary-unbounded' onClick={this.removeLocClick.bind(null, i)}>Remove</button>
          </div>
        </li>
      );
    });

    // When we have less than 3 cities allow for more to be added.
    if (locs.length < 3) {
      locsEl.push(this.renderCompareSelectOpts());
    }

    return locsEl;
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
      <p>Comparing {drop} values for local times</p>
    );
  },

  renderBrushChart: function () {
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
      let localDate = moment.parseZone(o.date.local).format('YYYY/MM/DD HH:mm:ss');
      return localDate >= weekAgo && localDate <= userNow;
    };

    // Prepare data.
    let chartData = _(this.props.compareMeasurements)
      .filter(o => o.fetched && !o.fetching && o.data)
      .map(o => {
        return _.cloneDeep(o.data.results)
          .filter(filterFn)
          .map(o => {
            o.value = convertParamIfNeeded(o);
            // Disregard timezone on local date.
            let dt = o.date.local.match(/^[0-9]{4}(?:-[0-9]{2}){2}T[0-9]{2}(?::[0-9]{2}){2}/)[0];
            // `measurement` local date converted directly to user local.
            o.date.localNoTZ = new Date(dt);
            return o;
          });
      })
      .value();

    let yMax = d3.max(chartData || [], r => d3.max(r, o => o.value)) || 0;

    // 1 Week.
    let xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

    // Only show the "no results" message if stuff has loaded
    let fetchedMeasurements = this.props.compareMeasurements.filter(o => o.fetched && !o.fetching);
    if (fetchedMeasurements.length) {
      let dataCount = chartData.reduce((prev, curr) => prev + curr.length, 0);

      if (!dataCount) {
        return (
          <InfoMessage>
            <p>There's no data for the selected parameter</p>
            <p>Maybe you'd like to suggest a <a href='#' title='Suggest a new source'>new source</a>.</p>
          </InfoMessage>
        );
      }
    }

    return (
      <ChartBrush
        className='brush-chart'
        data={chartData}
        xRange={xRange}
        yRange={[0, yMax]}
        yLabel={`Values in ${activeParam.preferredUnit}`} />
    );
  },

  render: function () {
    let locs = this.props.compareLoc.filter(o => o.fetched || o.fetching);

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Compare Locations</h1>
              <div className='inpage__headline-actions'>
                <ShareBtn />
              </div>
            </div>

            <div className='compare'>
              <ul className='compare__location-list'>
                {this.renderCompareLocations()}
              </ul>
            </div>

          </div>
        </header>
        <div className='inpage__body'>
          {locs.length ? (
            <section className='fold'>
              <div className='inner'>
                <header className='fold__header'>
                  <h1 className='fold__title'>Comparing measurements</h1>
                  <div className='fold__introduction'>
                    {this.renderParameterSelector()}
                  </div>
                </header>
                <div className='fold__body'>
                  {this.renderBrushChart()}
                </div>
              </div>
            </section>
          ) : null}
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
    parameters: state.baseData.data.parameters,

    compareLoc: state.compare.locations,
    compareSelectOpts: state.compare.compareSelectOpts,
    compareMeasurements: state.compare.measurements,

    locations: state.locations
  };
}

function dispatcher (dispatch) {
  return {
    _selectCompareOptions: (...args) => dispatch(selectCompareOptions(...args)),
    _cancelCompareOptions: (...args) => dispatch(cancelCompareOptions(...args)),

    _selectCompareCountry: (...args) => dispatch(selectCompareCountry(...args)),
    _selectCompareArea: (...args) => dispatch(selectCompareArea(...args)),
    _selectCompareLocation: (...args) => dispatch(selectCompareLocation(...args)),

    _fetchLocations: (...args) => dispatch(fetchLocations(...args)),
    _invalidateLocations: (...args) => dispatch(invalidateLocations(...args)),

    _invalidateCompare: (...args) => dispatch(invalidateCompare(...args)),

    _fetchCompareLocationIfNeeded: (...args) => dispatch(fetchCompareLocationIfNeeded(...args)),
    _removeCompareLocation: (...args) => dispatch(removeCompareLocation(...args)),

    _fetchCompareLocationMeasurements: (...args) => dispatch(fetchCompareLocationMeasurements(...args))
  };
}

module.exports = connect(selector, dispatcher)(Compare);
