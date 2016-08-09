'use strict';
import React from 'react';
import { connect } from 'react-redux';

import ShareBtn from '../components/share-btn';

var Compare = React.createClass({
  displayName: 'Compare',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Compare page</h1>
              <div className='inpage__headline-actions'>
                <ShareBtn />
              </div>
            </div>

            <div className='compare'>
              <ul className='compare__location-list'>
                <li className='compare__location'>
                  <p className='compare__subtitle'>Updates hourly</p>
                  <h2 className='compare__title'><span className='compare-marker compare-marker--st'>Location</span> <small>in area, country</small></h2>
                  <div className='compare__actions'>
                    <button type='button' className='button button--small button--primary-unbounded'>Edit</button>
                    <button type='button' className='button button--small button--primary-unbounded'>Delete</button>
                  </div>
                </li>
                <li className='compare__location'>
                  <p className='compare__subtitle'>Updates hourly</p>
                  <h2 className='compare__title'><span className='compare-marker compare-marker--nd'>Location</span> <small>in area, country</small></h2>
                  <div className='compare__actions'>
                    <button type='button' className='button button--small button--primary-unbounded'>Edit</button>
                    <button type='button' className='button button--small button--primary-unbounded'>Delete</button>
                  </div>
                </li>
                {/*
                <li className='compare__location'>
                  <p className='compare__subtitle'>Updates hourly</p>
                  <h2 className='compare__title'><span className='compare-marker compare-marker--rd'>Location</span> <small>in area, country</small></h2>
                  <div className='compare__actions'>
                    <button type='button' className='button button--small button--primary-unbounded'>Edit</button>
                    <button type='button' className='button button--small button--primary-unbounded'>Delete</button>
                  </div>
                </li>
                */}
                <li className='compare__location-actions'>
                  <button type='button' className='button-compare-location'>Add Location</button>
                </li>
              </ul>
            </div>

          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--filled'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Our data</h1>
              </header>
              <div className='fold__body'>
              </div>
            </div>
          </section>

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

module.exports = connect(selector, dispatcher)(Compare);
