'use strict';
import React from 'react';
import createReactClass from 'create-react-class';

import testimonials from '../../content/testimonials.json';
import AmbassadorCardDetails from '../components/ambassador-card';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var Ambassadors = createReactClass({
  displayName: 'About the Community',

  propTypes: {},

  getTestimonial: function () {
    if (!this.randomTestimonial) {
      // Pick a random testimonial for this mount.
      // This will be removed in the future in favor of a carousel
      this.randomTestimonial =
        testimonials[Math.floor(Math.random() * (testimonials.length - 1))];
    }
    return [this.randomTestimonial];
  },

  render: function () {
    return (
      <section className="inpage">
        <header className="inpage__header inpage__header--jumbo">
          <div className="inner">
            <div className="inpage__headline">
              <h1 className="inpage__title">Ambassador Program</h1>
              <div className="inpage__introduction">
                <p>
                  The OpenAQ Ambassador Program is a leadership program designed
                  for air quality advocates committed to utilizing open air
                  quality data to spur community action to fight air pollution.
                  By bringing together a community of change-makers, we aim to
                  amplify the impact of air quality initiatives around the
                  globe.
                </p>
              </div>
            </div>
          </div>
          <figure className="inpage__media inpage__media--cover media">
            <div className="media__item">
              <img
                src="/assets/graphics/content/view--community-hub/cover--community.jpg"
                alt="Cover image"
                width="1440"
                height="710"
              />
            </div>
          </figure>
        </header>
        <div className="inpage__body">
          <section className="fold" id="ambassador-fold-participate">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">2021 Ambassador Cohort</h1>
                <h1 classNama="fold__subtitle">
                  To read more about the 2021 Community Ambassadors, please
                  visit our{' '}
                  <a href="https://openaq.medium.com/announcing-the-inaugural-openaq-community-ambassador-cohort-9707a51380e3">
                    blog post
                  </a>
                  {'.'}
                </h1>
              </header>
              <ul className="participate-list">
                <li>
                  <article className="card card--participate">
                    <div className="card__contents">
                      <div className="ambassador-photo">
                        <img
                          src="/assets/graphics/content/ambassadors/ambassador_farah_kazi_crop.jpeg"
                          width="300"
                          height="auto"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Farah Kazi (Mumbai, India)
                            </h1>
                            <h3 className="card__project">Waataravan</h3>
                          </div>
                        </header>
                        <div className="card__body">
                          <div className="card__prose prose prose--responsive">
                            <p>
                              Farah manages air quality monitoring initiatives
                              and builds communication strategies to raise
                              awareness of air pollution and to advance policy
                              reforms on air quality. She has a background in
                              biotechnology and data visualization.
                            </p>
                          </div>
                          <AmbassadorCardDetails youtubeEmbedId="J47SsCH0bi0" />
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
                <li>
                  <article className="card card--participate">
                    <div className="card__contents">
                      <div className="ambassador-photo">
                        <img
                          src="/assets/graphics/content/ambassadors/ambassador_ray_koci_crop.jpeg"
                          width="300"
                          height="auto"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Ray Koci (Tirana, Albania)
                            </h1>
                            <h3 className="card__project">
                              Qendra Marrëdhënie
                            </h3>
                          </div>
                        </header>
                        <div className="card__body">
                          <div className="card__prose prose prose--responsive">
                            <p>
                              Ray examines urban neighborhood planning to build
                              safe and healthy spaces for children and their
                              caregivers. She has a background in urban planning
                              and management.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
                <li>
                  <article className="card card--participate">
                    <div className="card__contents">
                      <div className="ambassador-photo">
                        <img
                          src="/assets/graphics/content/ambassadors/ambassador_josephine_mbandi_crop.png"
                          width="300"
                          height="auto"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Josephine Mbandi (Nairobi, Kenya)
                            </h1>
                            <h3 className="card__project">
                              AfriSTEM Connection{' '}
                            </h3>
                          </div>
                        </header>
                        <div className="card__body">
                          <div className="card__prose prose prose--responsive">
                            <p>
                              Josephine works with communities to design,
                              develop, test, and maintain low-cost sensors for
                              air quality monitoring. She has a background in
                              systems engineering and is passionate about
                              Science, Technology, Engineering, and Mathematic
                              (STEM).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
                <li>
                  <article className="card card--participate">
                    <div className="card__contents">
                      <div className="ambassador-photo">
                        <img
                          src="/assets/graphics/content/ambassadors/ambassador_melusi_molefe_crop.png"
                          width="300"
                          height="auto"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Melusi Molefe (Durban, South Africa)
                            </h1>
                            <h3 className="card__project">
                              City of Durban Air Pollution Management
                            </h3>
                          </div>
                        </header>
                        <div className="card__body">
                          <div className="card__prose prose prose--responsive">
                            <p>
                              Melusi leads the implementation of the Air Quality
                              Management Plan for the municipality of Durban. He
                              has a background in chemical engineering and
                              environmental engineering and sciences.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
                <li>
                  <article className="card card--participate">
                    <div className="card__contents">
                      <div className="ambassador-photo">
                        <img
                          src="/assets/graphics/content/ambassadors/ambassador_aza_tsogtsaikhan_crop.jpeg"
                          width="300"
                          height="auto"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Azjargal Tsogtsaikhan(Ulaanbaatar, Mongolia)
                            </h1>
                            <h3 className="card__project">Breathe Mongolia</h3>
                          </div>
                        </header>
                        <div className="card__body">
                          <div className="card__prose prose prose--responsive">
                            <p>
                              Aza is the Founder and Director of Breathe
                              Mongolia, a grassroots nonprofit organization
                              focused on raising awareness of air pollution to
                              spark policy change. Aza has a background in
                              public health policy and economics.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </section>

          <section className="fold fold--semi-light fold--type-a">
            <header className="fold__header">
              <h1 className="fold__title">
                OpenAQ Community Ambassador Curriculum Overview
              </h1>
            </header>
            <div className="inner">
              <header className="fold__header ambassador-details">
                <h2>Monthly Education Sessions</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    The ambassadors will engage in readings, guest lectures,
                    workshops, and seminars focused on pertinent air
                    quality-related topics including open air quality data,
                    public health analysis, low-cost sensor monitoring, and air
                    quality philanthropy. Each month, there will be a guest
                    speaker who will share their expertise and engage in an
                    interactive tutorial with the ambassadors.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/ambassadors/ambassadors_workshops.jpeg"
                  alt="Fold media"
                  width="1060"
                  height="906"
                />
              </figure>
            </div>

            <div className="inner">
              <header className="fold__header ambassador-details">
                <h2>Community Feature</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    An opportunity to be featured share an overview of the
                    ambassador’s work and air quality challenges and
                    opportunities to connect with various funding organizations
                    and other professional networks.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/ambassadors/ambassadors_community_feature.jpeg"
                  alt="Fold media"
                  width="1060"
                  height="906"
                />
              </figure>
            </div>

            <div className="inner">
              <header className="fold__header ambassador-details">
                <h2>Professional Development Opportunities</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Opportunities to speak at international conferences and
                    workshops and be featured as a monthly community leader
                    highlighting the ambassador’s work and priority areas.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/ambassadors/ambassadors_development_opportunities.jpeg"
                  alt="Fold media"
                  width="1060"
                  height="906"
                />
              </figure>
            </div>

            <div className="inner">
              <header className="fold__header ambassador-details">
                <h2>Community Air Quality Workshops</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Each ambassador will be trained to conduct multi-stakeholder
                    workshops in their community, with the goal to
                    collaboratively identify challenges, brainstorm solutions,
                    and develop a tangible action plan to fight air pollution.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/ambassadors/ambassadors_workshops_monthly_sessions.jpeg"
                  alt="Fold media"
                  width="1060"
                  height="906"
                />
              </figure>
            </div>

            <div className="inner">
              <header className="fold__header ambassador-details">
                <h2>Air Quality Data Toolkit</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    Each ambassador will develop a step-by-step guide and
                    utilization application of the data available on OpenAQ to
                    help improve air quality in diverse ways.
                  </p>
                </div>
              </header>
              <figure className="fold__media">
                <img
                  src="/assets/graphics/content/ambassadors/ambassadors_data_toolkit.jpeg"
                  alt="Fold media"
                  width="1060"
                  height="906"
                />
              </figure>
            </div>
          </section>

          <section className="connect-fold">
            <div className="inner">
              <header className="connect-fold__header">
                <h1 className="connect-fold__title">
                  Ready to become the next
                  <br />
                  OpenAQ Community Ambassador?
                </h1>
                <h3 className="connect-fold__subtitle">
                  If you are interested in applying to become an OpenAQ
                  Community Ambassador and join the 2022 cohort, please sign up
                  for the OpenAQ Newsletter -- we will be announcing the next
                  application cycle later this year!
                </h3>
                <div className="ambassadors-email-list">
                  <a
                    className="button button--large button--primary-ghost button--capsule"
                    title="View page"
                    href="https://openaq.us10.list-manage.com/subscribe/post?u=ca93b2911fff40db15f6e7203&amp;id=e65a8618a1"
                  >
                    <span>Subscribe to our newsletter!</span>
                  </a>
                </div>
              </header>
            </div>
          </section>
        </div>
      </section>
    );
  },
});

module.exports = Ambassadors;
