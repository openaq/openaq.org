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
              <h1 className="inpage__title">
                OpenAQ Community Ambassador Program
              </h1>
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
          <section
            className="fold ambassador-fold"
            id="ambassador-fold-participate"
          >
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">2021 Ambassador Cohort</h1>
                <h3 classNama="fold__subtitle">
                  To read more about the 2021 Community Ambassadors, please
                  visit our{' '}
                  <a href="https://openaq.medium.com/announcing-the-inaugural-openaq-community-ambassador-cohort-9707a51380e3">
                    blog post
                  </a>
                  {'.'}
                </h3>
              </header>
              <ul className="participate-list">
                <li>
                  <article className="card card--participate">
                    <div className="card__contents">
                      <div className="ambassador-photo">
                        <img
                          src="/assets/graphics/content/ambassadors/ambassador_farah_kazi_square.jpeg"
                          width="300"
                          height="300"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Farah Kazi (Mumbai, India)
                            </h1>
                            <p className="card__project">Waataravan</p>
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
                          <AmbassadorCardDetails
                            linkedIn="https://www.linkedin.com/in/farah-kazi/"
                            youtubeEmbedId="J47SsCH0bi0"
                          />
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
                          src="/assets/graphics/content/ambassadors/ambassador_ray_koci_square.jpg"
                          width="300"
                          height="300"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Ray Koci (Tirana, Albania)
                            </h1>
                            <p className="card__project">Qendra Marrëdhënie</p>
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
                          <AmbassadorCardDetails linkedIn="https://www.linkedin.com/in/ray-k-00b8a5b7/" />
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
                          src="/assets/graphics/content/ambassadors/ambassador_josephine_mbandi_square.jpg"
                          width="300"
                          height="300"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Josephine Mbandi (Nairobi, Kenya)
                            </h1>
                            <p className="card__project">
                              AfriSTEM Connection{' '}
                            </p>
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
                          <AmbassadorCardDetails
                            linkedIn="https://www.linkedin.com/in/josephine-mwikali-3124711b/"
                            youtubeEmbedId="sOGG6sM6p64"
                          />
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
                          src="/assets/graphics/content/ambassadors/ambassador_melusi_molefe_square.jpg"
                          width="300"
                          height="300"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Melusi Molefe (Durban, South Africa)
                            </h1>
                            <p className="card__project">
                              City of Durban Air Pollution Management
                            </p>
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
                          <AmbassadorCardDetails linkedIn="https://www.linkedin.com/in/modise-molefe-00333180/" />
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
                          src="/assets/graphics/content/ambassadors/ambassador_aza_tsogtsaikhan_square.jpeg"
                          width="300"
                          height="300"
                          alt="Card cover"
                        />
                      </div>
                      <div className="ambassador-details">
                        <header className="card__header">
                          <div className="card__headline">
                            <h1 className="card__title">
                              Azjargal Tsogtsaikhan (Ulaanbaatar, Mongolia)
                            </h1>
                            <p className="card__project">Breathe Mongolia</p>
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

          <section
            id="ambassador-fold-curriculum"
            className="fold fold--semi-light fold--type-a ambassador-fold"
          >
            <div className="inner">
              <header className="fold__header curriculum__header">
                <h1 className="fold__title">
                  OpenAQ Community Ambassador Curriculum Overview
                </h1>
                <h3 classNama="fold__subtitle">
                  The ambassadors will participate in an opening orientation
                  where the cohort will connect with one another virtually,
                  learn about their respective fields, and begin to dive into
                  their roles as OpenAQ Community Ambassadors. The program
                  consists of exciting opportunities to grow professionally and
                  learn about the role of open air quality data on a global
                  scale including:
                </h3>
              </header>
            </div>
            <div className="inner">
              <header className="fold__header ambassador-details">
                <h2>Monthly Education Sessions</h2>
                <div className="fold__teaser prose prose--responsive">
                  <p>
                    The ambassadors engage in readings, guest lectures,
                    workshops, and seminars focused on pertinent air
                    quality-related topics including open air quality data,
                    public health analysis, low-cost sensor monitoring, and air
                    quality philanthropy. Each month, there are guest speakers
                    who share their expertise and engage in an interactive
                    tutorial with the ambassadors.
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
                    Ambassadors have an opportunity to share and highlight their
                    work on air quality as part of a “Community Feature”. This
                    feature includes a short video, social media coverage, and
                    will spark opportunities to connect with various
                    professional networks, including funding organizations.
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
                    Ambassadors have opportunities to speak at international
                    conferences and workshops and be featured as a monthly
                    community leader highlighting the ambassador’s work and
                    priority areas.
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
                    Each ambassador conducts multi-stakeholder workshops in
                    their community, with the goal to collaboratively identify
                    challenges, brainstorm solutions, and develop a tangible
                    action plan to fight air pollution.
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
                    Each ambassador develops a step-by-step guide and
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
                  Interested in becoming the next
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
