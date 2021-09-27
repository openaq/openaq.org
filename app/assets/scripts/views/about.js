'use strict';
import React from 'react';
import _ from 'lodash';
import createReactClass from 'create-react-class';

import JoinFold from '../components/join-fold';
import SponsorList from '../components/sponsor-list';
import TeamList from '../components/team-list';

import content from '../../content/content.json';
import sponsors from '../../content/sponsors.json';

const teamData = {
  advisoryBoard: _(content.advisoryBoard).values().sortBy(['order']).value(),
  governingBoard: _(content.governingBoard).values().sortBy(['order']).value(),
  team: _(content.team).values().sortBy(['order']).value(),
};

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var About = createReactClass({
  displayName: 'About',

  propTypes: {},

  render: function () {
    return (
      <section className="inpage">
        <header className="inpage__header">
          <div className="inner">
            <div className="inpage__headline">
              <h1 className="inpage__title">About us</h1>
              <div className="inpage__introduction">
                <p>
                  Our mission is to fight air inequality by opening up air
                  quality data and connecting a diverse global, grassroots
                  community of individuals and organizations.
                </p>
              </div>
            </div>
          </div>
          <figure className="inpage__media inpage__media--cover media">
            <div className="media__item">
              <img
                src="/assets/graphics/content/view--about/cover--about.jpg"
                alt="Cover image"
                width="1440"
                height="712"
              />
            </div>
          </figure>
        </header>
        <div className="inpage__body">
          <section className="fold fold--intro" id="about-fold-intro">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">We are guided by principles</h1>
              </header>

              <ul className="principles-list">
                <li>
                  <article className="card card--principle">
                    <div className="card__contents">
                      <figure className="card__media">
                        <div className="card__badge">
                          <img
                            src="/assets/graphics/layout/oaq-icon-illu-48-historical.svg"
                            width="40"
                            height="40"
                            alt="Illustration"
                          />
                        </div>
                      </figure>
                      <header className="card__header">
                        <div className="card__headline">
                          <h1 className="card__title">
                            Historical + Programmatic access
                          </h1>
                        </div>
                      </header>
                      <div className="card__body">
                        <div className="card__prose prose prose--responsive">
                          <p>Giving air quality data a wider audience.</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>

                <li>
                  <article className="card card--principle">
                    <div className="card__contents">
                      <figure className="card__media">
                        <div className="card__badge">
                          <img
                            src="/assets/graphics/layout/oaq-icon-illu-48-opensource.svg"
                            width="40"
                            height="40"
                            alt="Illustration"
                          />
                        </div>
                      </figure>
                      <header className="card__header">
                        <div className="card__headline">
                          <h1 className="card__title">Open source</h1>
                        </div>
                      </header>
                      <div className="card__body">
                        <div className="card__prose prose prose--responsive">
                          <p>Encouraging collaboration in the open.</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>

                <li>
                  <article className="card card--principle">
                    <div className="card__contents">
                      <figure className="card__media">
                        <div className="card__badge">
                          <img
                            src="/assets/graphics/layout/oaq-icon-illu-48-community.svg"
                            width="40"
                            height="40"
                            alt="Illustration"
                          />
                        </div>
                      </figure>
                      <header className="card__header">
                        <div className="card__headline">
                          <h1 className="card__title">Community driven</h1>
                        </div>
                      </header>
                      <div className="card__body">
                        <div className="card__prose prose prose--responsive">
                          <p>Working to help each other do impactful work.</p>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </section>

          <section className="fold fold--type-a" id="about-fold-story">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">Our story</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    The idea for OpenAQ came from observing the impact of a lone
                    air quality monitor producing open data, set up by the U.S.
                    Embassy in Beijing.
                  </p>
                  <p>
                    It spurred OpenAQ co-founders, Christa Hasenkopf, an
                    atmospheric scientist, and Joe Flasher, a software
                    developer, to set up a small open air quality project in
                    Ulaanbaatar along with Mongolian colleagues.
                  </p>
                  <p>
                    Eventually, they and a community of open data lovers from
                    around the world decided to see what would happen if all of
                    the world’s air quality data were made available for the
                    public to explore.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <aside className="aside-highlight">
                  <div className="aside-highlight__contents">
                    <div className="aside-highlight__prose">
                      <p>
                        What if all of the world’s air quality data were
                        available to explore?
                      </p>
                    </div>
                  </div>
                </aside>
              </figure>
            </div>
          </section>

          <section className="fold fold--stacked" id="about-fold-main-board">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">Our Team</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Our team is passionate about fighting air inequality with
                    open data. If you would like to make an inquiry to the team,
                    please reach out to{' '}
                    <a href="mailto:info@openaq.org">info@openaq.org</a>
                  </p>
                </div>
              </header>

              <TeamList items={teamData.team} />
            </div>
          </section>

          <section className="fold fold--stacked" id="about-fold-main-board">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">Our Board</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    The Governing Board oversees the legal and financial
                    operations of OpenAQ. If you would like to make an inquiry
                    to the board, please reach out to{' '}
                    <a href="mailto:info@openaq.org">info@openaq.org</a>.
                  </p>
                </div>
              </header>

              <TeamList items={teamData.governingBoard} />
            </div>
          </section>

          <section
            className="fold fold--stacked"
            id="about-fold-advisory-board"
          >
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">Our Advisory Board</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    The Advisory Board consists of world-class leaders in air
                    quality, public health, and open data. The board advises
                    OpenAQ on its overall strategy.
                  </p>
                </div>
              </header>

              <TeamList items={teamData.advisoryBoard} />
            </div>
          </section>

          <section className="fold fold--semi-light" id="about-fold-sponsors">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">Partners and Sponsors</h1>
              </header>
              <SponsorList items={sponsors} />
              <footer className="fold__footer">
                <a
                  href="mailto:info@openaq.org"
                  className="sponsor-button"
                  title="View page"
                >
                  <span>Become a sponsor</span>
                </a>
              </footer>
            </div>
          </section>

          <section className="fold fold--type-b" id="about-fold-book">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">We are an open book</h1>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    We value transparency so all our records are publicly
                    available.
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
                    href="/assets/files/openaq-990-2020.pdf"
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

          <JoinFold />
        </div>
      </section>
    );
  },
});

module.exports = About;
