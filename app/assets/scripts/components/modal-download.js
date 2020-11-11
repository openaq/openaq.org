'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import c from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import { stringify as buildAPIQS } from 'qs';
import OpenAQ from 'openaq-design-system';
const { Modal, ModalHeader, ModalBody } = OpenAQ.Modal;
import createReactClass from 'create-react-class';

import { toggleValue } from '../utils/array';
import {
  fetchLocationsByCountry,
  invalidateLocationsByCountry
} from '../actions/action-creators';
import config from '../config';
import { formatThousands } from '../utils/format';

var ModalDownload = createReactClass({
  displayName: 'ModalDownload',

  propTypes: {
    _fetchLocationsByCountry: T.func,
    _invalidateLocationsByCountry: T.func,
    onModalClose: T.func,

    countries: T.array,
    parameters: T.array,

    locationsByCountry: T.object,

    // Preselect
    country: T.string,
    area: T.string,
    location: T.string
  },

  apiLimit: 65536,

  getInitialState: function () {
    return {
      locCountry: this.props.country || '--',
      locArea: this.props.area || '--',
      locLocation: this.props.location || '--',

      startYear: '--',
      startMonth: '--',
      startDay: '--',

      endYear: '--',
      endMonth: '--',
      endDay: '--',

      parameters: [],

      selectionCount: null
    };
  },

  //
  // Event Listeners
  //

  onOptSelect: function (key, e) {
    let state = {[key]: e.target.value};
    if (key === 'locCountry') {
      this.props._invalidateLocationsByCountry();
      this.props._fetchLocationsByCountry(e.target.value);
      state.locArea = '--';
      state.locLocation = '--';
    } else if (key === 'locArea') {
      state.locLocation = '--';
    }

    this.setState(state);
  },

  onParameterSelect: function (value) {
    let parameters = this.state.parameters;
    parameters = toggleValue(parameters, value);

    this.setState({parameters});
  },

  computeApiUrl: function (values, initalQS = {}) {
    let state = _.clone(values);
    _.forEach(state, (o, i) => {
      if (o === null || o === '--' || !o.length) {
        delete state[i];
      }
    });

    if (state.startYear && state.startMonth && state.startDay) {
      let sDate = moment(`${state.startYear}/${parseInt(state.startMonth) + 1}/${state.startDay}`, 'YYYY/M/D');
      if (sDate.isValid()) {
        state.sDate = sDate.toISOString();
      }
    }

    if (state.endYear && state.endMonth && state.endDay) {
      let eDate = moment(`${state.endYear}/${parseInt(state.endMonth) + 1}/${state.endDay}`, 'YYYY/M/D');
      if (eDate.isValid()) {
        state.eDate = eDate.toISOString();
      }
    }

    // Build url.
    let qs = initalQS;

    // It's enough to have one of these.
    if (state.locLocation) {
      qs.location = state.locLocation;
    } else if (state.locArea) {
      qs.city = state.locArea;
    } else if (state.locCountry) {
      qs.country = state.locCountry;
    }

    if (state.sDate) {
      qs.date_from = state.sDate;
    }

    if (state.eDate) {
      qs.date_to = state.eDate;
    }

    if (state.parameters) {
      qs.parameter = state.parameters;
    }

    qs = `${config.api}/measurements?${buildAPIQS(qs)}`;
    // console.log('computeDownloadUrl', qs);

    return qs;
  },

  computeDownloadUrl: function (values) {
    return this.computeApiUrl(values, {format: 'csv'});
  },

  checkSelectionCount: function (url) {
    // What is going on here?
    // The api is limited to 65,536 results, but some download options
    // combinations yield a lot more results. They could potentially
    // return the whole database (when nothing is selected). This is not
    // really an option, so the results are limited.
    // Nevertheless the user has to be warned of this, so on every parameter
    // change we query the api to know how many results would be returned, and
    // show a message in case the number is above the limit.
    // This is clearly a redux antipattern specially because we're not using
    // action but this is supposed to be temporary although we all know this
    // will probably stay here for a while.
    // Alas, TODO: do it properly!
    fetch(url)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => this.setState({selectionCount: json.meta.found}),
        e => console.log('e', e)
      );
  },

  //
  // life-cycle Methods
  //

  componentDidMount: function () {
    if (this.props.country) {
      this.props._fetchLocationsByCountry(this.props.country);
    }
  },

  componentWillUpdate: function (nextProps, nextState) {
    let prevUrl = this.computeApiUrl(this.state, {limit: 1});
    let nextUrl = this.computeApiUrl(nextState, {limit: 1});
    prevUrl !== nextUrl && this.checkSelectionCount(nextUrl);
  },

  //
  // Render Methods
  //

  renderDateSelector: function (what) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let days = d3.range(1, 32, 1);
    let years = d3.range(2015, (new Date()).getFullYear() + 1, 1);
    return (
      <fieldset className='form__fieldset form__fieldset--date'>
        <legend className='form__legend'>{what === 'start' ? 'Start' : 'End'} Date</legend>
        <div className='form__group'>
          <label htmlFor={`${what}-year`} className='form__label'>Year</label>
          <select id={`${what}-year`} className='form__control form__control--medium select--base-bounded' value={this.state[`${what}Year`]} onChange={this.onOptSelect.bind(null, `${what}Year`)}>
            <option value='--'>Year</option>
            {years.map(o => <option key={`startyear-${o}`} value={o}>{o}</option>)}
          </select>
        </div>
        <div className='form__group'>
          <label htmlFor={`${what}-month`} className='form__label'>Month</label>
          <select id={`${what}-month`} className='form__control form__control--medium select--base-bounded' value={this.state[`${what}Month`]} onChange={this.onOptSelect.bind(null, `${what}Month`)}>
            <option value='--'>Month</option>
            {months.map((o, i) => <option key={o} value={i}>{o}</option>)}
          </select>
        </div>
        <div className='form__group'>
          <label htmlFor={`${what}-day`} className='form__label'>Day</label>
          <select id={`${what}-day`} className='form__control form__control--medium select--base-bounded' value={this.state[`${what}Day`]} onChange={this.onOptSelect.bind(null, `${what}Day`)}>
            <option value='--'>Day</option>
            {days.map(o => <option key={`startday-${o}`} value={o}>{o}</option>)}
          </select>
        </div>
      </fieldset>
    );
  },

  renderLocationSelector: function () {
    let {fetching: fetchingLocations, fetched: fetchedLocations, data: {results: locations}} = this.props.locationsByCountry;

    // Mental Sanity note: we use area to designate the broader region where a sensor
    // is while the API call it city.
    // Areas and Locations belonging to the selected country.
    // Will be filtered from the this.props.locations;
    let compareAreas = [];
    let compareLocations = [];

    if (locations) {
      compareAreas = _(locations)
        .filter(o => o.country === this.state.locCountry)
        .uniqBy('city')
        .sortBy('city')
        .value();

      if (locations && this.state.locArea !== '--') {
        compareLocations = _(locations)
          .filter(o => {
            // Has to belong to the correct area and can't have been selected before.
            return o.city === this.state.locArea;
          })
          .uniqBy('location')
          .sortBy('location')
          .value();
      }
    }

    let compareAreasLabel = fetchingLocations ? 'Loading Data' : 'Select an Area';
    let compareLocationsLabel = fetchingLocations ? 'Loading Data' : 'Select a Location';

    // Disable area while the locations are not fetched.
    let disableArea = !fetchedLocations || fetchingLocations;
    // Disable locations if locations are not fetched or are not selected
    let disableLocation = disableArea || this.state.locArea === '--';

    return (
      <fieldset className='form__fieldset form__fieldset--location'>
        <legend className='form__legend'>Location Selector</legend>
        <div className='form__group'>
          <label htmlFor='loc-country' className='form__label'>Country</label>
          <select id='loc-country' className='form__control form__control--medium select--base-bounded' value={this.state.locCountry} onChange={this.onOptSelect.bind(null, 'locCountry')}>
            <option value='--'>Select a Country</option>
            {this.props.countries.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
          </select>
        </div>
        <div className={c('form__group', {disabled: disableArea})}>
          <label htmlFor='loc-area' className='form__label'>Area</label>
          <select id='loc-area' className='form__control form__control--medium select--base-bounded' value={this.state.locArea} onChange={this.onOptSelect.bind(null, 'locArea')}>
            <option value='--'>{compareAreasLabel}</option>
            {compareAreas.map(o => <option key={o.city} value={o.city}>{o.city}</option>)}
          </select>
        </div>
        <div className={c('form__group', {disabled: disableLocation})}>
          <label htmlFor='loc-location' className='form__label'>Location</label>
          <select id='loc-location' className='form__control form__control--medium select--base-bounded' value={this.state.locLocation} onChange={this.onOptSelect.bind(null, 'locLocation')}>
            <option value='--'>{compareLocationsLabel}</option>
            {compareLocations.map(o => <option key={o.location} value={o.location}>{o.location}</option>)}
          </select>
        </div>
      </fieldset>
    );
  },

  renderParameters: function () {
    return (
      <fieldset className='form__fieldset form__fieldset--parameters'>
        <legend className='form__legend'>Parameters</legend>
        <div className='form__option-group'>
          {this.props.parameters.map(o => {
            let checked = this.state.parameters.indexOf(o.id) !== -1;
            let onChange = this.onParameterSelect.bind(null, o.id);
            return (
              <label className='form__option form__option--custom-checkbox' htmlFor={o.id} key={o.id}>
                <input type='checkbox' value={o.id} id={o.id} name='form-checkbox' onChange={onChange} checked={checked} />
                <span className='form__option__text'>{o.name}</span>
                <span className='form__option__ui'></span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  },

  renderResultCountMessage: function () {
    let countMessage = null;
    if (this.state.selectionCount !== null && this.state.selectionCount > this.apiLimit) {
      countMessage = <p style={{textAlign: 'center'}}>The API has a limit of {formatThousands(this.apiLimit)} measurements and your query yields {formatThousands(this.state.selectionCount)}, therefore results will be limited.</p>;
    }

    return countMessage;
  },

  render: function () {
    const measurementsCount = this.props.countries.reduce((p, c) => p + Number(c.count), 0);
    return (
      <Modal
        id='modal-download'
        className='modal--medium'
        onCloseClick={this.props.onModalClose}
        revealed >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'>Data Download</h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='prose'>
            <p className='modal__description'>Customize the data you want to download. Currently, the last two years of data are available from this form. <a href="https://openaq-fetches.s3.amazonaws.com/index.html" target="_blank">Realtime</a> and <a href="http://openaq-data.s3.amazonaws.com/index.html" target="_blank">daily</a> archives of all {formatThousands(measurementsCount)} are also available. <a href="https://github.com/openaq/openaq-info/blob/master/FAQ.md#90days" target="_blank">More Info</a> </p>

            <form className='form form--download'>
              {this.renderLocationSelector()}
              {this.renderDateSelector('start')}
              {this.renderDateSelector('end')}
              {this.renderParameters()}
              {this.renderResultCountMessage()}

              <div className='form__actions'>
                <button type='button' className='button button--primary-bounded' onClick={this.props.onModalClose}>Cancel</button>
                <a href={this.computeDownloadUrl(this.state)} className={c('button-modal-download', {disabled: false})} target='_blank'>Download Selection <small>(csv)</small></a>
              </div>
            </form>

          </div>
        </ModalBody>
      </Modal>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    countries: state.baseData.data.countries,
    parameters: state.baseData.data.parameters,

    locationsByCountry: state.locationsByCountry
  };
}

function dispatcher (dispatch) {
  return {
    _invalidateLocationsByCountry: (...args) => dispatch(invalidateLocationsByCountry(...args)),
    _fetchLocationsByCountry: (...args) => dispatch(fetchLocationsByCountry(...args))
  };
}

module.exports = connect(selector, dispatcher)(ModalDownload);
