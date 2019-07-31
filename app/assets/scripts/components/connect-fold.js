'use strict';
import React from 'react';
import { Link } from 'react-router';

var ConnectFold = React.createClass({
  displayName: 'ConnectFold',

  render: function () {
    return (
      <section className='connect-fold'>
        <div className='inner'>
          <header className='connect-fold__header'>
            <h1 className='connect-fold__title'>Connect with the community.</h1>
            <div className='prose prose--responsive'>
              <p>Brainstorm and work together with our community on ways to use open air quality data to fight air inequality.</p>
            </div>
          </header>

          <div className='connect-fold__cards'>
            <article className='card card--connect'>
              <div className='card__contents'>
                <header className='card__header'>
                  <div className='card__headline'>
                    <h1 className='card__title'>GitHub</h1>
                  </div>
                </header>
                <div className='card__body'>
                  <div className='card__prose'>
                    <p>Find out more about our repositories.</p>
                  </div>
                </div>
                <footer className='card__footer'>
                  <Link to='#' className='connect-card__go-link' title='Follow us on GitHub'><span>Follow</span></Link>
                </footer>
              </div>
            </article>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = ConnectFold;
