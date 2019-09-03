'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import config from '../config';
import { sortBy } from 'lodash';
import { formatThousands } from '../utils/format';
import { openDownloadModal } from '../actions/action-creators';

var CountriesHub = React.createClass({
  displayName: 'CountriesHub',

  propTypes: {
    _openDownloadModal: React.PropTypes.func,
    countries: React.PropTypes.array
  },

  onDownloadClick: function (country, e) {
    e.preventDefault();
    this.props._openDownloadModal({country: country});
  },

  renderCountryList: function () {
    return sortBy(this.props.countries, 'name').map(o => (
      <li className='country-list__item' key={o.code}>
        <article className='card'>
          <div className='card__contents'>
            <header className='card__header'>
              <div className='card__headline'>
                <h1 className='card__title'><Link to={`/countries/${o.code}`} title={`View ${o.name} page`}>{o.name || 'N/A'}</Link></h1>
              </div>
            </header>
            <div className='card__body'>
              <dl className='card__meta-details'>
                <dt>Measurements</dt>
                <dd>{formatThousands(o.count)}</dd>
                <dt>Locations</dt>
                <dd>{formatThousands(o.locations)}</dd>
              </dl>
            </div>
            <footer className='card__footer'>
              <ul className='card__footer-actions'>
                <li><a href='#' className='cfa-download' title={`Download data for ${o.name}`} onClick={this.onDownloadClick.bind(null, o.code)}>Download</a></li>
                <li><Link to={`/countries/${o.code}`} className='cfa-go' title={`View ${o.name} page`}>View More</Link></li>
              </ul>
            </footer>
          </div>
        </article>
      </li>
    ));
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Browse by Country</h1>
              <div className='inpage__introduction'>
                <p>We are currently collecting data in {this.props.countries.length} different countries and are always seeking to add more. We aggregate PM2.5, PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and black carbon (BC) from real-time government and research grade sources. If you cannot find the location that you are looking for, please <a href='https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform' title='Suggest a new source'>suggest a source</a> and <a href='mailto:info@openaq.org' title='Contact openaq'>send us an email</a>.</p>
                <small className='disclaimer'><a href='https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85'>Data Disclaimer and More Information</a></small>
              </div>
              <ul className='ipha'>
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
          <div className='fold'>
            <div className='inner'>
              <ol className='country-list'>
                {this.renderCountryList()}
              </ol>
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
    countries: state.baseData.data.countries
  };
}

function dispatcher (dispatch) {
  return {
    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args))
  };
}

module.exports = connect(selector, dispatcher)(CountriesHub);
