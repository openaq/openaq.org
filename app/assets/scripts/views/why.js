'use strict';
import React from 'react';
import { connect } from 'react-redux';
import JoinFold from '../components/join-fold';

var Why = React.createClass({
  displayName: 'Why open air quality?',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header inpage__header--jumbo'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Why open air quality?</h1>
              <div className='inpage__introduction'>
                <p>Because everyone sould have access to clean air.</p>
              </div>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--why/cover--why.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>

          <section className='block' id='why-block-intro'>
            <div className='inner'>
              <header className='block__header'>
                <h1 className='block__title'>Poor air quality is one of the largest public health threats of our time.</h1>
              </header>
              <div className='block__teaser prose prose--responsive'>
                <ul className='big-stats'>
                  <li><strong>8.8M</strong> <span>deaths each year</span></li>
                  <li><strong>90%</strong> <span>in developing countries</span></li>
                </ul>
              </div>
            </div>
          </section>

          <JoinFold />

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

module.exports = connect(selector, dispatcher)(Why);
