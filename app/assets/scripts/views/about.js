'use strict';
import React from 'react';
import { connect } from 'react-redux';

var About = React.createClass({
  displayName: 'About',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline header--centered'>
              <h1 className='inpage__title'>About Us</h1>
              <div className='inpage__introduction'>
                <p>We’re building the world’s first open platform that provides programmatic real-time and historical access to air quality data from around the globe.</p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--media-bleed-left'>
            <div className='inner'>
              <div className='fold__media'>
                <figure className='media' style={{backgroundImage: 'url(assets/graphics/content/about1.png)'}}>
                  <img className='media__item' src='assets/graphics/content/about1.png' width='768' height='768' alt='About image 1' />
                </figure>
              </div>
              <div className='fold__copy'>
                <header className='fold__header'>
                  <h1 className='fold__title'>Our Mission</h1>
                </header>
                <div className='fold__body'>
                  <p>The mission of OpenAQ is to build the world’s first open air quality data hub in order to enable previously impossible science, inform policy and empower the public around air pollution.</p>
                </div>
                <a a href='https://medium.com/@openaq/the-mission-of-openaq-cb159084beeb#.moyanm8b0' target='_blank' className='button button--large button--primary-bounded'>Learn More</a>
              </div>
            </div>
          </section>

          <section className='fold fold--filled fold--media-bleed-right'>
            <div className='inner'>
              <div className='fold__media'>
                <figure className='media' style={{backgroundImage: 'url(assets/graphics/content/about2.png)'}}>
                  <img className='media__item' src='assets/graphics/content/about2.png' width='768' height='768' alt='About image 2' />
                </figure>
              </div>
              <div className='fold__copy'>
                <header className='fold__header'>
                  <h1 className='fold__title'>Data Aggregation</h1>
                </header>
                <div className='fold__body'>
                  <p>We aggregate our data from public real-time data sources provided by official, usually government-level, organizations. They do the hard work of measuring these data and publicly sharing them, and we do the work of making them more universally accessible to both humans and machines.</p>
                </div>
                <a href='https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85#.m5njeuxu3' target='_blank' className='button button--large button--primary-bounded'>Learn More</a>
              </div>
            </div>
          </section>

          <section className='fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Partners and Sponsors</h1>
              </header>
              <div className='fold__body'>
                <ul className='sponsors__list'>
                  <li><a className='sponsors__item' target='_blank' href='https://developmentseed.org/'><img src='assets/graphics/content/sponsors/devseed.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://aws.amazon.com/'><img src='assets/graphics/content/sponsors/aws.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://sites.agu.org/'><img src='assets/graphics/content/sponsors/agu.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://earthjournalism.net/'><img src='assets/graphics/content/sponsors/ejn.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.internews.org/'><img src='assets/graphics/content/sponsors/internews.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://keen.io/'><img src='assets/graphics/content/sponsors/keenio.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.nih.gov/'><img src='assets/graphics/content/sponsors/nih.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.openscienceprize.org/'><img src='assets/graphics/content/sponsors/openscience.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='http://thrivingearthexchange.org/'><img src='assets/graphics/content/sponsors/tex.png' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://wellcome.ac.uk/'><img src='assets/graphics/content/sponsors/wellcome.jpg' alt='View sponsor website'/></a></li>
                  <li><a className='sponsors__item' target='_blank' href='https://www.hhmi.org/'><img src='assets/graphics/content/sponsors/hhmi.jpg' alt='View sponsor website'/></a></li>
                </ul>
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

module.exports = connect(selector, dispatcher)(About);
