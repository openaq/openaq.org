'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import testimonials from '../../content/testimonials.json';
import widont from '../utils/widont';
import ConnectFold from '../components/connect-fold';
import Testimonials from '../components/testimonials.js';

var CommunityHub = React.createClass({
  displayName: 'About the Community',

  propTypes: {
  },

  getTestimonial: function () {
    if (!this.randomTestimonial) {
      // Pick a random testimonial for this mount.
      // This will be removed in the future in favor of a carousel
      this.randomTestimonial = testimonials[Math.floor(Math.random() * (testimonials.length - 1))];
    }
    return [this.randomTestimonial];
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header inpage__header--jumbo'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Community overview</h1>
              <div className='inpage__introduction'>
                <p>Passionate about air quality data? Join our Community.</p>
              </div>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--community-hub/cover--community.jpg' alt='Cover image' width='1440' height='710' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--intro'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>{widont('Scientists, software developers, educators, journalists, analysts, activists, lovers of open environmental data from around the globe working for one purpose.')}</h1>
              </header>
            </div>
          </section>

          <section className='fold fold--semi-light' id='community-fold-participate'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>How you can participate</h1>
              </header>
              <ul className='participate-list'>
                <li>
                  <article className='card card--participate'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <Link to='/community/projects' className='link-wrapper' title='View more'>
                          <div className='card__cover'>
                            <img src='/assets/graphics/content/view--community-hub/card-participate--impact.jpg' width='1080' height='720' alt='Card cover' />
                          </div>
                        </Link>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <Link to='/community/projects' className='link-wrapper' title='View more'>
                            <h1 className='card__title'>View Community impact</h1>
                          </Link>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Get inspired by the ways our Community are using data to fight air inequality.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <Link to='/community/projects' className='card__go-link' title='View more'><span>See projects</span></Link>
                      </footer>
                    </div>
                  </article>
                </li>

                <li>
                  <article className='card card--participate'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <Link to='/community/workshops' className='link-wrapper' title='View more'>
                          <div className='card__cover'>
                            <img src='/assets/graphics/content/view--community-hub/card-participate--workshops.jpg' width='1080' height='720' alt='Card cover' />
                          </div>
                        </Link>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <Link to='/community/workshops' className='link-wrapper' title='View more'>
                            <h1 className='card__title'>Invite us for a workshop</h1>
                          </Link>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>OpenAQ convenes local communities to build new collaborations and projects around open data.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <Link to='/community/workshops' className='card__go-link' title='View more'><span>See workshops</span></Link>
                      </footer>
                    </div>
                  </article>
                </li>

                <li>
                  <article className='card card--participate'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <Link to='/' className='link-wrapper' title='View more'>
                          <div className='card__cover'>
                            <img src='/assets/graphics/content/view--community-hub/card-participate--tools.jpg' width='1080' height='720' alt='Card cover' />
                          </div>
                        </Link>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <Link to='/' className='link-wrapper' title='View more'>
                            <h1 className='card__title'>Find Community tools</h1>
                          </Link>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Access free, open-source community tools created by the OpenAQ Community.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <Link to='/community/projects?type=Developer+tools' className='card__go-link' title='View more'><span>See the tools</span></Link>
                      </footer>
                    </div>
                  </article>
                </li>

                <li>
                  <article className='card card--participate'>
                    <div className='card__contents'>
                      <figure className='card__media'>
                        <Link to='/' className='link-wrapper' title='View more'>
                          <div className='card__cover'>
                            <img src='/assets/graphics/content/view--community-hub/card-participate--data-sources.jpg' width='1080' height='720' alt='Card cover' />
                          </div>
                        </Link>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <Link to='/' className='link-wrapper' title='View more'>
                            <h1 className='card__title'>Data sources</h1>
                          </Link>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Join other official organizations and governments around the world and share your air quality data.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <a href='https://medium.com/@openaq/how-can-a-government-source-add-data-to-openaq-50b5d83ef13f' target='_blank' className='card__go-link' title='View more'><span>Become a data source</span></a>
                      </footer>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </section>

          <Testimonials items={this.getTestimonial()} />

          <ConnectFold />

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

module.exports = connect(selector, dispatcher)(CommunityHub);
