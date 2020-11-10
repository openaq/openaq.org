'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { ScrollArea, Dropdown } from 'openaq-design-system';
import { hashHistory } from 'react-router';
import ReactPaginate from 'react-paginate';
import c from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import config from '../config';
import { toggleValue } from '../utils/array';
import { buildQS } from '../utils/url';
import { fetchLocations, openDownloadModal } from '../actions/action-creators';
import LocationCard from '../components/location-card';
import InfoMessage from '../components/info-message';
import LoadingMessage from '../components/loading-message';

var LocationsHub = React.createClass({
  displayName: 'LocationsHub',

  propTypes: {
    location: React.PropTypes.object,
    _fetchLocations: React.PropTypes.func,
    _openDownloadModal: React.PropTypes.func,

    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array,

    locFetching: React.PropTypes.bool,
    locFetched: React.PropTypes.bool,
    locError: React.PropTypes.string,
    locations: React.PropTypes.array,
    locPagination: React.PropTypes.object
  },

  perPage: 15,

  getPage: function () {
    let page = this.props.location.query.page;
    page = isNaN(page) || page < 1 ? 1 : +page;
    return page;
  },

  getTotalPages: function () {
    let {found, limit} = this.props.locPagination;
    return Math.ceil(found / limit);
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

  getQuerySources: function () {
    if (this.props.location.query.sources) {
      return this.props.location.query.sources.split(',');
    }
    return [];
  },

  getQueryOrderBy: function () {
    if (this.props.location.query.orderBy) {
      return this.props.location.query.orderBy.split(',');
    }
    return [];
  },

  shouldFetchData: function (prevProps) {
    let { countries: prevC, parameters: prevP, sources: prevS, orderBy: prevO } = prevProps.location.query;
    let { countries: currC, parameters: currP, sources: currS, orderBy: currO } = this.props.location.query;
    let prevPage = prevProps.location.query.page;
    let currPage = this.props.location.query.page;

    return prevC !== currC || prevP !== currP || prevS !== currS || prevO !== currO || prevPage !== currPage;
  },

  fetchData: function (page) {
    let filters = {
      country: this.getQueryCountries(),
      parameter: this.getQueryParameters(),
      order_by: this.getQueryOrderBy()
    };

    this.props._fetchLocations(page, filters, this.perPage);
  },

  //
  // Event Listeners
  //

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
      case 'sources':
        let sources = this.getQuerySources();
        query.sources = toggleValue(sources, value);
        !query.sources.length && delete query.sources;
        break;
      case 'orderBy':
        let orderBy = this.getQueryOrderBy();
        query.orderBy = toggleValue(orderBy, value);
        !query.orderBy.length && delete query.orderBy;
        break;

      case 'clear':
        delete query.countries;
        delete query.parameters;
        delete query.sources;
        delete query.orderBy;
        break;
    }

    hashHistory.push(`/locations?${buildQS(query)}`);
  },

  clearFilters: function (e) {
    e.preventDefault();
    this.onFilterSelect('clear');
  },

  handlePageClick: function (d) {
    let query = _.clone(this.props.location.query);
    query.page = d.selected + 1;
    hashHistory.push(`/locations?${buildQS(query)}`);
  },

  //
  // Start life-cycle methods
  //

  componentDidMount: function () {
    this.fetchData(1);
  },

  componentDidUpdate: function (prevProps) {
    this.shouldFetchData(prevProps) && this.fetchData(this.getPage());
  },

  //
  // Start render methods
  //

  renderFilters: function () {
    const { countries, parameters, sources } = this.props;
    let queryCountries = this.getQueryCountries();
    let queryParameters = this.getQueryParameters();
    let querySources = this.getQuerySources();
    let queryOrderBy = this.getQueryOrderBy();

    let sortOptions = [
      'location', 'country', 'city', 'count'
    ];

    return (
    <div className='filters'>
      <nav className='fold__nav'>
        <h2>Filter by</h2>
        <h2>Order by</h2>
      </nav>

      <Dropdown
        triggerElement='a'
        triggerTitle='country__filter'
        triggerText='Country'
        triggerClassName='drop-trigger'
      >
        <ul role='menu' className='drop__menu drop__menu--select scrollable'>
          {
            _.sortBy(countries).map(o => {
              return (
                  <li key={o.code}>
                    <div
                      className={c('drop__menu-item', {'drop__menu-item--active': queryCountries.includes(o.code)})}
                      data-hook='dropdown:close'
                      onClick={(e) => {
                        this.onFilterSelect('countries', o.code);
                      }}
                    >
                      <span>{o.name}</span>
                    </div>

                  </li>
              );
            }
            )
          }
        </ul>

      </Dropdown>

      <Dropdown
        triggerElement='a'
        triggerTitle='type__filter'
        triggerText='Pollutant'
      >
        <ul role='menu' className='drop__menu drop__menu--select scrollable'>
          {
            _.sortBy(parameters).map(o => {
              return (
                  <li key={o.id}>
                    <div
                      className={c('drop__menu-item', {'drop__menu-item--active': queryParameters.includes(o.code)})}
                      data-hook='dropdown:close'
                      onClick={(e) => {
                        this.onFilterSelect('parameters', o.id);
                      }}
                    >
                      <span>{o.name}</span>
                    </div>

                  </li>
              );
            }
            )
          }
        </ul>
      </Dropdown>

      <Dropdown
        triggerElement='a'
        triggerTitle='source__filter'
        triggerText='Data Source'
      >
        <ul role='menu' className='drop__menu drop__menu--select scrollable'>
          {
            _.sortBy(sources).map(o => {
              return (
                  <li key={o.name}>
                    <div
                      className={c('drop__menu-item', {'drop__menu-item--active': querySources.includes(o.code)})}

                      data-hook='dropdown:close'
                      onClick={(e) => {
                        this.onFilterSelect('sources', o.name);
                      }}
                    >
                      <span>{o.name}</span>
                    </div>

                  </li>
              );
            }
            )
          }
        </ul>
      </Dropdown>

      <Dropdown
        triggerElement='a'
        triggerTitle='sort__filter'
        triggerText='Order By'
        triggerClassName='sort-order'
      >
        <ul role='menu' className='drop__menu drop__menu--select scrollable'>
          {
            _.sortBy(sortOptions).map(o => {
              return (
                  <li key={o}>
                    <div
                      className={c('drop__menu-item', { 'drop__menu-item--active': queryOrderBy.includes(o) })}
                      data-hook='dropdown:close'
                      onClick={(e) => {
                        this.onFilterSelect('orderBy', o);
                      }}
                    >
                      <span>{`${o[0].toUpperCase()}${o.slice(1)}`}</span>
                    </div>
                  </li>
              );
            }
            )
          }
        </ul>

      </Dropdown>

    </div>

    );
  },

  renderCountries: function () {
    let queryCountries = this.getQueryCountries();
    return (
      <ScrollArea
        speed={0.8}
        className='filters__group'
        contentClassName='filters__group-inner'
        smoothScrolling={true}
        horizontal={false} >

        {_.sortBy(this.props.countries, 'name').map(o => {
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
    let sources = this.getQuerySources();
    let orderBy = this.getQueryOrderBy();

    // If there are no filters selected remove the whole block.
    if (countries.length + parameters.length + sources.length + orderBy.length === 0) {
      return null;
    }

    return (
      <div className='filters-summary'>
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
        {this.props.sources.map(o => {
          let onClick = this.onFilterSelect.bind(null, 'sources', o.name);
          return sources.indexOf(o.name) !== -1
            ? <button type='button' className='button--filter-pill' key={o.name} onClick={onClick}><span>{o.name}</span></button>
            : null;
        })}
        {orderBy.map(o => {
          let onClick = this.onFilterSelect.bind(null, 'orderBy', o);
          return <button type='button' className='button--filter-pill orderBy' key={o} onClick={onClick}><span>{o}</span></button>;
        })}

        <button type='button' className='button button--small button--primary-unbounded' title='Clear all selected filters' onClick={this.clearFilters}>
          <small> (Clear Filters)</small>
        </button>

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

  renderContent: function () {
    if (!this.props.locFetched && !this.props.locFetching) {
      return null;
    }

    if (this.props.locFetching) {
      return <LoadingMessage />;
    }

    if (this.props.locError) {
      return (
        <InfoMessage>
          <p>We coudn't get the data. Please try again later.</p>
          <p>If you think there's a problem, please <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
        </InfoMessage>
      );
    }

    if (!this.props.locations.length) {
      return (
        <InfoMessage>
          <p>No data was found for your criteria.</p>
          <p>Maybe you'd like to suggest a <a href='https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform' title='Suggest a new source'>new source</a> or <a href='mailto:info@openaq.org' title='Contact openaq'>let us know</a> what location you'd like to see data for.</p>
        </InfoMessage>
      );
    }

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
              name={o.location}
              city={o.city}
              sourceType={o.sourceType}
              countryData={countryData}
              sourcesData={sourcesData}
              totalMeasurements={o.count}
              parametersList={params}
              lastUpdate={o.lastUpdated}
              collectionStart={o.firstUpdated}
            />;
    });
  },

  renderPagination: function () {
    if (!this.props.locFetched || this.props.locError || !this.props.locations.length) {
      return null;
    }

    return (
      <ReactPaginate
        previousLabel={<span>previous</span>}
        nextLabel={<span>next</span>}
        breakLabel={<span className='pages__page'>...</span>}
        pageNum={this.getTotalPages()}
        forceSelected={this.getPage() - 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={4}
        clickCallback={this.handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages'}
        pageClassName={'pages__wrapper'}
        pageLinkClassName={'pages__page'}
        activeClassName={'active'} />
    );
  },

  render: function () {
    let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    let yesterdayDataUrl = `https://openaq-data.s3.amazonaws.com/${yesterday}.csv`;

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Air Quality Data</h1>
              <div className='inpage__introduction'>
                <p>We are currently collecting data in {this.props.countries.length} different countries and always seeking to add more. We aggregate PM2.5, PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and black carbon (BC) from real-time government and research grade sources. If you cannot find the location you are looking for, please <a href='https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform' title='Suggest a new source'>suggest a source</a> and <a href='mailto:info@openaq.org' title='Contact openaq'>send us an email</a>. The last 2 years of data are accessible here. Learn how to access older data <a href='https://medium.com/@openaq/how-in-the-world-do-you-access-air-quality-data-older-than-90-days-on-the-openaq-platform-8562df519ecd'title='Access older data'>here</a>.</p>
                <small className='disclaimer'><a href='https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85'>Data Disclaimer and More Information</a></small>
              </div>
              <ul className='ipha'>
                <li><a href={yesterdayDataUrl} className='ipha-download ipha-main' title="Yesterday's data in csv format" >Download Yesterday's Data</a></li>
                <li><a href={config.apiDocs} title='View API documentation' className='ipha-api' target='_blank'>View API Docs</a></li>
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
          <div className='inner'>
            <div className='inpage__content'>
              <div className='inpage__content__header'>
                {this.renderFilters()}
                {this.renderFilterSummary()}
              </div>
                <div className='content__meta'>
                  <div className="content__header">
                    {this.renderSort()}
                    <div className='content__heading'>
                      <h2 className='content-prime-title'>Results
                      </h2>
                      {this.props.locPagination.found ? <p className='results-summary'>A total of <strong>{this.props.locPagination.found}</strong> locations were found</p> : null}
                    </div>
                  </div>

                </div>

              <div className='inpage__results'>
                {this.renderContent()}
              </div>

              {this.renderPagination()}

              <div className='disclaimers'>
                <p>It is our intent to attribute all data to their originating sources. Please contact us if you notice any errors or have questions about attribution. </p>
                <p>Note: We do not guarantee the accuracy of any data aggregated to the platform. Please see originating sites for more information.</p>
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
    parameters: state.baseData.data.parameters,

    locFetching: state.locations.fetching,
    locFetched: state.locations.fetched,
    locError: state.locations.error,
    locations: state.locations.data.results,
    locPagination: state.locations.data.meta
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLocations: (...args) => dispatch(fetchLocations(...args)),
    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args))
  };
}

module.exports = connect(selector, dispatcher)(LocationsHub);
