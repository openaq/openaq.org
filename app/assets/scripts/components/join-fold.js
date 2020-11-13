'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import createReactClass from 'create-react-class';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var JoinFold = createReactClass({
  displayName: 'JoinFold',

  render: function () {
    return (
      <section className="join-fold">
        <div className="inner">
          <header className="join-fold__header">
            <h1 className="join-fold__title">
              Join a community that believes everyone should have access to
              clean air.
            </h1>
          </header>

          <div className="join-fold__cards">
            <article className="card card--join">
              <div className="card__contents">
                <figure className="card__media">
                  <div className="card__badge">
                    <img
                      src="/assets/graphics/layout/oaq-icon-illu-40-join-community.svg"
                      width="40"
                      height="40"
                      alt="Illustration"
                    />
                  </div>
                </figure>
                <header className="card__header">
                  <div className="card__headline">
                    <h1 className="card__title">Participate</h1>
                  </div>
                </header>
                <div className="card__body">
                  <div className="card__prose">
                    <p>Be a data source, a consumer or a platform builder.</p>
                  </div>
                </div>
                <footer className="card__footer">
                  <Link
                    to="/community"
                    className="join-card__go-link"
                    title="View more"
                  >
                    <span>Participate</span>
                  </Link>
                </footer>
              </div>
            </article>

            <article className="card card--join">
              <div className="card__contents">
                <figure className="card__media">
                  <div className="card__badge">
                    <img
                      src="/assets/graphics/layout/oaq-icon-illu-40-support.svg"
                      width="40"
                      height="40"
                      alt="Illustration"
                    />
                  </div>
                </figure>
                <header className="card__header">
                  <div className="card__headline">
                    <h1 className="card__title">Support our mission</h1>
                  </div>
                </header>
                <div className="card__body">
                  <div className="card__prose">
                    <p>Be a financial partner to help fight air inequality.</p>
                  </div>
                </div>
                <footer className="card__footer">
                  <a
                    href="mailto:info@openaq.org"
                    className="join-card__go-link"
                    title="View more"
                  >
                    <span>Support</span>
                  </a>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </section>
    );
  },
});

module.exports = JoinFold;
