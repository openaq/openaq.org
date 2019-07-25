'use strict';
import React from 'react';
import { Link } from 'react-router';

var JoinFold = React.createClass({
  displayName: 'JoinFold',

  render: function () {
    return (
      <section className='join-fold'>
        <div className='inner'>
          <header className='join-fold__header'>
            <h1 className='join-fold__title'>Join a community that believes everyone should have access to clean air.</h1>
          </header>

          <div className='join-fold__cards'>
            <article className='join-card'>
              <div className='inner'>
                <div className='join-card__media'>
                  <figure>
                    <img src='/assets/graphics/layout/oaq-icon-illu-40-join-community.svg' width='40' height='40' alt='Illustration' />
                  </figure>
                </div>
                <div className='join-card__copy'>
                  <h1 className='join-card__title'>Participate</h1>
                  <p>Be a data source, a consumer or a platform builder.</p>
                  <p className='join-card__main-action'>
                    <Link to='#' className='join-card__go-link' title='View more'><span>Participate</span></Link>
                  </p>
                </div>
              </div>
            </article>

            <article className='join-card'>
              <div className='inner'>
                <div className='join-card__media'>
                  <figure>
                    <img src='/assets/graphics/layout/oaq-icon-illu-40-support.svg' width='40' height='40' alt='Illustration' />
                  </figure>
                </div>
                <div className='join-card__copy'>
                  <h1 className='join-card__title'>Support our mission</h1>
                  <p>Be a financial partner to help fight air inequality.</p>
                  <p className='join-card__main-action'>
                    <Link to='#' className='join-card__go-link' title='View more'><span>Support</span></Link>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = JoinFold;
