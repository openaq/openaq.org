'use strict';
import React from 'react';
import _ from 'lodash';
import createReactClass from 'create-react-class';

import YoutubeEmbed from '../components/youtube-player';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var Donate = createReactClass({
  displayName: 'Donate',

  propTypes: {},

  render: function () {
    return (
      <section className="inpage">
        <header className="inpage__header">
          <section className="fold fold--type-a" id="donate-fold-story">
            <div className="inner">
              <header className="fold__header donate-window">
                <div>
                  <h1 className="fold__title">Donate now to OpenAQ!</h1>
                  <div className="prose prose--responsive">
                    <p>
                      Help support our mission to end air pollution through 
                      air quality data and community.
                    </p>
                  </div>
                  <div
                    id="give-lively-widget"
                    className="gl-simple-donation-widget"
                  ></div>
                </div>
              </header>
              <figure className="fold__media donate-info-wrapper">
                <YoutubeEmbed embedId="C66UmEWoPos" />
                <div className="donate-header-info">
                  <h3>Your donation helps...</h3>
                  <p>
                    Ongoing platform maintenance costs to our backend
                    and API that allows us to make data available free of charge
                  </p>
                  <p>
                    Integrating new data sources to the OpenAQ
                    platform for the global community to access and utilize.
                  </p>
                  <p>
                    Development of new tools and enhancements to the
                    OpenAQ platform to make these available for use free of
                    charge
                  </p>
                  <p>
                    Support community ambassador program, 10-month Program, a
                    program designed to train local eaders to open data and 
                    leadership in the air quality ecosystem.
                  </p>
                </div>
              </figure>
            </div>
          </section>
          <figure className="inpage__media inpage__media--cover media">
            <div className="media__item">
              <img
                src="/assets/graphics/content/view--home/cover--home.jpg"
                alt="Cover image"
                width="1440"
                height="712"
              />
            </div>
          </figure>
        </header>
        <div className="inpage__body">
        <section className="fold fold--type-b" id="donate-fold-story">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">Community Ambassador Program</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Funding supports training for inspiring community leaders 
                    like Farah Kazi, a dedicated air quality advocate in 
                    Maharashtra, India. Farah is participating in OpenAQ’s 
                    10-month Ambassador Program, a program designed to train 
                    local leaders to open data and leadership in the air quality 
                    ecosystem.
                  </p>
                  <p className="fold__action">
                    <a
                      href="https://openaq.medium.com/now-accepting-applications-for-the-openaq-community-ambassador-program-c0aee81735d5"
                      title="Learn more"
                      className="go-link"
                    >
                      <span>Learn more about this program</span>
                    </a>
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <aside className="aside-highlight">
                  <div className="aside-highlight__contents">
                    <div className="aside-highlight__prose">
                      <p>
                        <span>“</span>It's been a great three months since I
                        joined the OpenAQ Ambassador Program I have been
                        connected to and have been learning from leaders from
                        across the world that are fighting air inequality from
                        within their communities. OpenAQ through it's
                        centralized data platform provides access to open air
                        quality data from around the globe. It's so much easier
                        now to compare air quality between cities and even
                        countries.<span>”</span>
                      </p>
                      <p className="donate-quote-credit">- Farah Kazi</p>
                    </div>
                  </div>
                </aside>
              </figure>
            </div>
          </section>
          <section className="fold fold--semi-light fold--type-a">
            <div className="inner">
              <header className="fold__header">
                <h2 className="fold__title">Wear OpenAQ shirts</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    This June 2021, in honor of World Environment Day, we would
                    like to celebrate the OpenAQ Community and support efforts
                    to fight air inequality by selling OpenAQ swag! Please join
                    us in wearing OpenAQ shirts with pride and spreading the
                    word of Clean Air for All!
                  </p>
                  <p className="fold__action">
                    <a
                      href="https://www.customink.com/fundraising/2021-openaq-summer-swag-fundraiser?side=front&type=1&zoom=false"
                      title="View OpenAQ shirt options"
                      className="go-link"
                    >
                      <span>View options</span>
                    </a>
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/view--donate/shirts_fundraiser.png"
                  alt="Fold media"
                  width="1060"
                  height="906"
                />
              </figure>
            </div>
          </section>
          <section className="fold fold--type-b" id="donate-fold-book">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">We are an open book</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                  For more information about how funds are used check out our 990 form and the <a
                      href="https://github.com/openaq/openaq-info/blob/master/FAQ.md"
                      target="_blank"
                      rel="noreferrer"
                      title="Download"
                    >FAQs page</a>.
                  </p>
                  <p className="fold__main-action">
                    <a
                      href="/assets/files/openaq-990-2019.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="button-book-download"
                      title="Download"
                    >
                      <span>Download 2019 Form 990</span>
                    </a>
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <article className="card card--book">
                  <a
                    href="/assets/files/openaq-990-2019.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="card__contents"
                    title="Download"
                  >
                    <header className="card__header">
                      <div className="card__headline">
                        <p className="card__subtitle">2019</p>
                        <h1 className="card__title">Form 990</h1>
                      </div>
                    </header>
                    <figure className="card__media">
                      <div className="card__thumb">
                        <img
                          src="/assets/graphics/content/view--about/card-book-media.jpg"
                          width="724"
                          height="348"
                          alt="Card media"
                        />
                      </div>
                    </figure>
                    <footer className="card__footer">
                      <img
                        src="/assets/graphics/layout/oaq-logo-col-pos.svg"
                        alt="OpenAQ logotype"
                        width="72"
                        height="40"
                      />
                    </footer>
                  </a>
                </article>
              </figure>
            </div>
          </section>
        </div>
      </section>
    );
  },
});

module.exports = Donate;
