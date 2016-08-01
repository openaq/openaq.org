'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { formatThousands } from '../utils/format';

var CountriesHub = React.createClass({
  displayName: 'CountriesHub',

  propTypes: {
    countries: React.PropTypes.array
  },

  renderCountryList: function () {
    return this.props.countries.map(o => (
      <article className='card card--data-compact' key={o.code}>
        <div className='card__contents'>
          <header className='card__header'>
            <h1 className='card__title'><Link to={`/countries/${o.code}`} title={`View ${o.name} page`}>{o.name}</Link></h1>
          </header>
          <div className='card__body'>
            <ul className='card__meta-details'>
              <li>Measurements: {formatThousands(o.count)}</li>
              <li>Locations: {formatThousands(o.locations)}</li>
            </ul>
          </div>
          <footer className='card__footer'>
            <ul className='card__actions'>
              <li><a href='#' className='button-card-download' title={`Download data for ${o.name}`}>Download</a></li>
              <li><Link to={`/countries/${o.code}`} className='button-card-view' title={`View ${o.name} page`}>View More</Link></li>
            </ul>
          </footer>
        </div>
      </article>
    ));
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Browse by Country</h1>
            </div>
            <div className='inpage__introduction'>
              <p>We’re currently collecting data in 20 different countries and continuously adding more. We aggregate PM2.5, PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and black carbon (BC). If you can’t find the location you’re looking for please <a href='#' title='Suggest a new source'>suggest a source</a> of <a href='#' title='Contact openaq'>send us an email</a>.</p>
            </div>
            <div className='inpage__actions'>
              <ul>
                <li><a href='' title='View API documentation' className='button-inpage-api'>View API Docs</a></li>
              </ul>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold' id='countries-list'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Country list</h1>
              </header>
              <div className='fold__body'>
                {this.renderCountryList()}
              </div>
            </div>
          </section>

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
  };
}

module.exports = connect(selector, dispatcher)(CountriesHub);
