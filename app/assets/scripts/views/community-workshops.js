'use strict';
import React from 'react';
import { connect } from 'react-redux';
import widont from '../utils/widont';

import WorkshopFold from '../components/workshop-fold';

var CommunityWorkshops = React.createClass({
  displayName: 'Workshops',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline header--centered'>
              <h1 className='inpage__title'>Workshops</h1>
              <div className='inpage__introduction'>
                <p>{widont('Projects of our community using the data to fight air inquality in the most exciting ways.')}</p>
              </div>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--home/cover--home.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>

          <section className='fold' id='community-fold-workshops'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Workshops</h1>
                <nav className='fold__nav'>
                  <h2>Filter by</h2>
                  <h3>Location</h3>
                  <a href='#' title='Filter by location'><span>All locations</span></a>
                  <p className='summary'>Showing 34 projects</p>
                </nav>
              </header>
              <ul className='workshop-list'>
                <li>
                  <article className='card card--workshop'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <div className='card__cover'>
                          <img src='https://via.placeholder.com/640x320' width='640' height='320' alt='Card cover' />
                        </div>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <p className='card__subtitle'>Delhi, India</p>
                          <h1 className='card__title'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis place.</h1>
                        </div>
                      </header>
                      <footer className='card__footer'>
                        <p className='card__footer-detail'>May 2018</p>
                      </footer>
                    </div>
                  </article>
                </li>

                <li>
                  <article className='card card--workshop'>
                    <a className='card__contents' href='#' title='View more'>
                      <figure className='card__media'>
                        <div className='card__cover'>
                          <img src='https://via.placeholder.com/640x320' width='640' height='320' alt='Card cover' />
                        </div>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <p className='card__subtitle'>Delhi, India</p>
                          <h1 className='card__title'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec convallis place.</h1>
                        </div>
                      </header>
                      <footer className='card__footer'>
                        <p className='card__footer-detail'>May 2018</p>
                      </footer>
                    </a>
                  </article>
                </li>
              </ul>
            </div>
          </section>

          <WorkshopFold />
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

module.exports = connect(selector, dispatcher)(CommunityWorkshops);
