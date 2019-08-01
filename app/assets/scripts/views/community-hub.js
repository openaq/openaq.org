'use strict';
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import widont from '../utils/widont';
import ConnectFold from '../components/connect-fold';

var CommunityHub = React.createClass({
  displayName: 'About the Community',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header inpage__header--jumbo'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Community overview</h1>
              <div className='inpage__introduction'>
                <p>Passioned about air quality data? Join our community.</p>
              </div>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--community-hub/cover--community-hub.jpg' alt='Cover image' width='1440' height='710' />
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
                        <Link to='/' className='link-wrapper' title='View more'>
                          <div className='card__cover'>
                            <img src='/assets/graphics/content/view--community-hub/card-participate--impact.jpg' width='1080' height='720' alt='Card cover' />
                          </div>
                        </Link>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <Link to='/' className='link-wrapper' title='View more'>
                            <h1 className='card__title'>Community impact</h1>
                          </Link>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>A community using the data to fight air inquality in the most exciting ways.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <Link to='/' className='card__go-link' title='View more'><span>See projects</span></Link>
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
                            <img src='/assets/graphics/content/view--community-hub/card-participate--workshops.jpg' width='1080' height='720' alt='Card cover' />
                          </div>
                        </Link>
                      </figure>
                      <header className='card__header'>
                        <div className='card__headline'>
                          <Link to='/' className='link-wrapper' title='View more'>
                            <h1 className='card__title'>Workshops</h1>
                          </Link>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Convene local communities to start new projects and collaborations to fight air pollution.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <Link to='/' className='card__go-link' title='View more'><span>See workshops</span></Link>
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
                            <h1 className='card__title'>Community tools</h1>
                          </Link>
                        </div>
                      </header>
                      <div className='card__body'>
                        <div className='card__prose prose prose--responsive'>
                          <p>Access free, open-source community tools created by the OpenAQ community.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <Link to='/' className='card__go-link' title='View more'><span>See the tools</span></Link>
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
                          <p>Official organizations  measuring air quality data and publicly sharing them.</p>
                        </div>
                      </div>
                      <footer className='card__footer'>
                        <Link to='/' className='card__go-link' title='View more'><span>Become a data source</span></Link>
                      </footer>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </section>

          <section className='testimonials'>
            <div className='inner'>
              <h1 className='testimonials__title'>Testimonials</h1>
              <ol className='testimonials-list'>
                <li>
                  <blockquote className='testimonial'>
                    <div className='testimonial__media'>
                      <img src='/assets/graphics/content/testimonials/testimonial-avatar--amrit-sharma.jpg' width='762' height='830' alt='Testimonial avatar' />
                    </div>
                    <div className='testimonial__copy'>
                      <div className='testimonial__quote'>
                        <p>{widont('Every time I take a breath in Delhi, I\'m grateful that OpenAQ exists <3.')}</p>
                      </div>
                      <footer className='testimonial__footer'>
                        <strong>Amrit Sharma</strong>
                        <small>airairair.org Founder, Canada/India</small>
                      </footer>
                    </div>
                  </blockquote>
                </li>
              </ol>
            </div>
          </section>

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
