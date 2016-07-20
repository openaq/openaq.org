'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { ScrollArea, Dropdown } from 'openaq-design-system';
import { hashHistory } from 'react-router';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import LocationCard from '../components/location-card';
import { toggleValue } from '../utils/array';

var LocationsHub = React.createClass({
  displayName: 'LocationsHub',

  propTypes: {
    location: React.PropTypes.object,
    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array
  },

  buildUrl: function (qParams) {
    let stringified = _.map(qParams, (v, k) => {
      let val = _.isArray(v) ? v.join(',') : v;
      return `${k}=${val}`;
    });
    return stringified.join('&');
  },

  getQueryCountries: function () {
    if (this.props.location.query.countries) {
      return this.props.location.query.countries.split(',');
    }
    return [];
  },

  getQueryParameters: function () {
    if (this.props.location.query.parameters) {
      return this.props.location.query.parameters.split(',');
    }
    return [];
  },

  onFilterSelect: function (what, value) {
    let query = _.clone(this.props.location.query);
    switch (what) {
      case 'countries':
        let countries = this.getQueryCountries();
        query.countries = toggleValue(countries, value);
        !query.countries.length && delete query.countries;
        break;
      case 'parameters':
        let parameters = this.getQueryParameters();
        query.parameters = toggleValue(parameters, value);
        !query.parameters.length && delete query.parameters;
        break;
      case 'clear':
        delete query.countries;
        delete query.parameters;
        break;
    }

    hashHistory.push(`/locations?${this.buildUrl(query)}`);
  },

  clearFilters: function (e) {
    e.preventDefault();
    this.onFilterSelect('clear');
  },

  //
  // Start life-cycle methods
  //
  componentDidMount: function () {
  },

  //
  // Start render methods
  //

  renderCountries: function () {
    let queryCountries = this.getQueryCountries();
    return (
      <ScrollArea
        speed={0.8}
        className='filters__group'
        contentClassName='filters__group-inner'
        smoothScrolling={true}
        horizontal={false} >

        {this.props.countries.map(o => {
          let checked = queryCountries.indexOf(o.code) !== -1;
          let onChange = this.onFilterSelect.bind(null, 'countries', o.code);
          return (
            <label className='form__option form__option--custom-checkbox' htmlFor={o.name} key={o.code}>
              <input type='checkbox' value={o.code} id={o.name} name='form-checkbox' onChange={onChange} checked={checked} />
              <span className='form__option__text'>{o.name}</span>
              <span className='form__option__ui'></span>
            </label>
          );
        })}

      </ScrollArea>
    );
  },

  renderParameters: function () {
    let queryParameters = this.getQueryParameters();
    return (
      <ScrollArea
        speed={0.8}
        className='filters__group'
        contentClassName='filters__group-inner'
        smoothScrolling={true}
        horizontal={false} >

        {this.props.parameters.map(o => {
          let checked = queryParameters.indexOf(o.id) !== -1;
          let onChange = this.onFilterSelect.bind(null, 'parameters', o.id);
          return (
            <label className='form__option form__option--custom-checkbox' htmlFor={o.id} key={o.id}>
              <input type='checkbox' value={o.id} id={o.id} name='form-checkbox' onChange={onChange} checked={checked} />
              <span className='form__option__text'>{o.name}</span>
              <span className='form__option__ui'></span>
            </label>
          );
        })}
      </ScrollArea>
    );
  },

  renderFilterSummary: function () {
    let countries = this.getQueryCountries();
    let parameters = this.getQueryParameters();

    // If there are no filters selected remove the whole block.
    if (countries.length + parameters.length === 0) {
      return null;
    }

    return (
      <div className='filters-summary'>
        <h3 className='filters-summary-title'>Filters <a href='#' title='Clear all selected filters' onClick={this.clearFilters}><small>(Clear All)</small></a></h3>
        {this.props.countries.map(o => {
          let onClick = this.onFilterSelect.bind(null, 'countries', o.code);
          return countries.indexOf(o.code) !== -1
            ? <button type='button' className='button--filter-pill' key={o.code} onClick={onClick}><span>{o.name}</span></button>
            : null;
        })}
        {this.props.parameters.map(o => {
          let onClick = this.onFilterSelect.bind(null, 'parameters', o.id);
          return parameters.indexOf(o.id) !== -1
            ? <button type='button' className='button--filter-pill' key={o.id} onClick={onClick}><span>{o.name}</span></button>
            : null;
        })}
      </div>
    );
  },

  renderSort: function () {
    // No sort for the time being.
    // No support from the API.
    return null;

    // <div className='content__actions'>
    //   <h3>Sort By</h3>
    //   <Dropdown
    //     triggerElement='a'
    //     triggerClassName='button button--primary-bounded drop__toggle--caret'
    //     triggerTitle='Show/hide sort options'
    //     triggerText='Recently Updated' >

    //     <ul role='menu' className='drop__menu drop__menu--select'>
    //       <li><a className='drop__menu-item drop__menu-item--active' title='This is Item 1b' href='#'>Recenty Updated</a></li>
    //       <li><a className='drop__menu-item' title='This is Item 2b' href='#'>Name</a></li>
    //       <li><a className='drop__menu-item' title='This is Item 3b' href='#'>Measurements</a></li>
    //     </ul>
    //   </Dropdown>
    // </div>
  },

  renderPagination: function () {
    return (
      <ReactPaginate
        previousLabel={<span>previous</span>}
        nextLabel={<span>next</span>}
        breakLabel={<span className='pages__page'>...</span>}
        pageNum={15}
        forceSelected={3 - 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        clickCallback={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages'}
        pageClassName={'pages__wrapper'}
        pageLinkClassName={'pages__page'}
        activeClassName={'active'} />
    );
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Air Quality Data</h1>
              <div className='inpage__introduction'>
                <p>We’re currently collecting data in 20 different countries and continuously adding more. We aggregate PM2.5, PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and black carbon (BC). If you can’t find the location you’re looking for please suggest the source of send us an email.</p>
                <p><a href='#' className='button-inpage-download'>Download Daily Data - 2016/07/18 <small>(3MB)</small></a></p>
              </div>
            </div>
            <div className='inpage__actions'>
              <a href='' className='button-inpage-api'>API</a>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
          <div className='fold full-flex'>
            <div className='inner'>

              <aside className='inpage__aside'>
                <h2 className='content-prime-title'>Filter Locations</h2>

                <div className='filters filters--country'>
                  <h3 className='filters__title'>Countries</h3>
                  {this.renderCountries()}
                </div>

                <div className='filters filters--values'>
                  <h3 className='filters__title'>Values</h3>
                  {this.renderParameters()}
                </div>
              </aside>

              <div className='inpage__content'>
                <div className='content__meta'>
                  {this.renderFilterSummary()}
                  {this.renderSort()}

                  <div className='content__heading'>
                    <h2 className='content-prime-title'>Results <small>Showing <strong>1235</strong> locations</small></h2>
                  </div>
                </div>

                <div className='inpage__results'>
                  <LocationCard />
                  <LocationCard />
                  <LocationCard />
                  <LocationCard />
                  <LocationCard />
                </div>

                {this.renderPagination()}

                <div className='disclaimers'>
                  <p>Data are from official, stationary government monitors and not smaller-scale or mobile monitors. It is our intent to attribute all data to their originating sources. Please contact us if you notice otherwise. </p>
                  <p>Note: We do not guarantee the accuracy of any data aggregated to the platform.  Please see originating sites for more information.</p>
                </div>
              </div>
            </div>
          </div>
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
    parameters: state.baseData.data.parameters
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(LocationsHub);
