'use strict';
import React from 'react';

import createReactClass from 'create-react-class';

import ConnectFold from '../components/connect-fold';

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
                      Help support our mission to achieve clean air through air
                      quality data and community. Donate below or directly with{' '}
                      <a
                        href="https://www.dafdirect.org/DAFDirect/daflink?_dafdirect_settings=NDc1MzI0MTcyXzIxMTFfZDA0ODQ3MzYtOGJkOS00YTJjLWFmOTctM2Q2MGE3YTg4MDU4&designatedText=Z2VuZXJhbCBvcmdhbml6YXRpb25hbCBzdXBwb3J0ICh1bnJlc3RyaWN0ZWQp&amountValue="
                        target="_blank"
                        rel="noreferrer"
                      >
                        DAF
                      </a>
                      .
                    </p>
                  </div>
                  <div
                    id="give-lively-widget"
                    className="gl-simple-donation-widget"
                  ></div>
                  <div className="donate-daf">
                    <p>
                      <span>
                        We are a registered 501(c)(3). If US-based, your
                        donation is tax deductible. <br></br>
                        If you contribute through a DAF, please{' '}
                        <a href="info@openaq.org">send us an email </a>
                        so we can update the campaign total!
                      </span>
                    </p>
                  </div>
                </div>
              </header>
              <figure className="fold__media donate-info-wrapper">
                <YoutubeEmbed embedId="FntU6TXpb2g" />
                <div className="donate-header-info">
                  <h3>Your donation helps support...</h3>
                  <p>
                    Key programs and initiatives like our Community Ambassador
                    Program, a 10-month Program designed to train local leaders
                    on open data and tools to aid their work to fight air
                    pollution.
                  </p>
                  <p>
                    Development of new tools and enhancements to the OpenAQ
                    platform to improve access and usability.
                  </p>
                  <p>
                    Integration of new data sources and technologies to the
                    OpenAQ platform to improve coverage and transparency of
                    global air quality data.
                  </p>
                  <p>
                    Ongoing administrative as well as platform maintenance costs
                    to ensure the data and tools are available free of charge.
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
                <h1>Community Ambassador Program</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Funding helps support programs like OpenAQ’s Community
                    Ambassador program, training inspiring community leaders
                    like Farah Kazi, a dedicated air quality advocate in
                    Maharashtra, India. Farah is participating in OpenAQ’s
                    10-month Ambassador Program, a program designed to train
                    local leaders on open data and leadership to fight air
                    pollution in their communities.
                  </p>
                  <p className="fold__action">
                    <a
                      href="https://openaq.medium.com/announcing-the-inaugural-openaq-community-ambassador-cohort-9707a51380e3"
                      title="Learn more"
                      className="go-link"
                    >
                      <span>Meet all the ambassadors and learn more</span>
                    </a>
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <aside className="aside-highlight">
                  <div className="aside-highlight__contents">
                    <div className="aside-highlight__prose">
                      <p>
                        <span>“</span>It&apos;s been a great three months since
                        I joined the OpenAQ Ambassador Program. I have been
                        connected to and have been learning from leaders from
                        across the world that are fighting air inequality from
                        within their communities. OpenAQ through it&apos;s
                        centralized data platform provides access to open air
                        quality data from around the globe. It&apos;s so much
                        easier now to compare air quality between cities and
                        even countries.<span>”</span>
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
                <h2>
                  Wear a cool OpenAQ t-shirt that helps us fight air inequality!
                </h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    This June 2021, in honor of World Environment Day, we would
                    like to celebrate the OpenAQ Community and support efforts
                    to fight air inequality by releasing some new OpenAQ swag
                    available for a limited time only! Your purchase will help
                    support our work in democratizing access to air quality data
                    to enable community action to fight air pollution. Please
                    join us in wearing OpenAQ shirts and spreading the word of
                    #CleanAirforAll!
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
                <h1>We are an open book</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    For more information about how funds are used check out our
                    990 form and the{' '}
                    <a
                      // eslint-disable-next-line inclusive-language/use-inclusive-words
                      href="https://github.com/openaq/openaq-info/blob/master/FAQ.md"
                      target="_blank"
                      rel="noreferrer"
                      title="Download"
                    >
                      FAQs page
                    </a>
                    .
                  </p>
                  <p className="fold__main-action">
                    <a
                      href="/assets/files/openaq-990-2020.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="button-book-download"
                      title="Download"
                    >
                      <span>Download 2020 Form 990</span>
                    </a>
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <article className="card card--book">
                  <a
                    href="/assets/files/openaq-990-2020.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="card__contents"
                    title="Download"
                  >
                    <header className="card__header">
                      <div className="card__headline">
                        <p className="card__subtitle">2020</p>
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
          <ConnectFold />
        </div>
      </section>
    );
  },
});

module.exports = Donate;
