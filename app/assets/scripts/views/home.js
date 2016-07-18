'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
  },

  renderNearby: function () {
    // temporary
    return (
    <div>
      {[0, 0, 0].map(o => {
        return (
          <article className='card card--data-compact'>
            <div className='card__contents'>
              <header className='card__header'>
                <p className='card__subtitle'>Updated <strong>1 hour ago</strong></p>
                <h1 className='card__title'><a href='#' title='View Wollogong page'>Wollogong</a> in Illawara, Australia</h1>
              </header>
              <div className='card__body'>
                <ul className='card__meta-details'>
                  <li>Measurements: 30,665 since 01/03/2015</li>
                  <li>Values: PM2.5, PM10, O3</li>
                  <li>Source: <a href='#' title='View source for Wollogong'>EPA</a></li>
                </ul>
              </div>
              <footer className='card__footer'>
                <ul className='card__actions'>
                  <li><a href='#' className='button-card-download' title='Download data for Wollogong'>Download</a></li>
                  <li><a href='#' className='button-card-view' title='View Wollogong page'>View More</a></li>
                </ul>
              </footer>
            </div>
          </article>
        );
      })}
      </div>
    );
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'><em>Open, Real-time</em> Air Quality Data</h1>
              <div className='inpage__introduction'>
                <p>We are aggregating, standardzing and sharing air quality data by building a real-time database that provides programmatic and historical access to air quality data.</p>
                <p><Link to='/about' className='button button--large button--base-bounded'>Learn More</Link></p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--filled' id='home-stats'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Our data</h1>
                <div className='fold__introduction prose prose--responsive'>
                  <p>OpenAQ has collected <strong>14,104,644</strong> air quality measurements from <strong>12,341</strong> locations in <strong>22</strong> countries. Data is aggregated from <strong>146</strong> sources.</p>
                </div>
              </header>
            </div>
          </section>

          <section className='fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Nearby locations</h1>
                <div className='fold__introduction prose prose--responsive'>
                  <p>There are <strong>3 sites</strong> located within <strong>5km</strong> radius of your current location.</p>
                </div>
              </header>
              <div className='fold__body'>
                {this.renderNearby()}
              </div>
            </div>
          </section>

          <section className='fold fold--filled'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Compare locations</h1>
              </header>
              <div className='fold__body'>
              </div>
            </div>
          </section>

          <section className='fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Join our community</h1>
              </header>
              <div className='fold__body'>
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
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(Home);
