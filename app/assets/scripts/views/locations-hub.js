'use strict';
import React from 'react';
import { connect } from 'react-redux';

var LocationsHub = React.createClass({
  displayName: 'LocationsHub',

  propTypes: {
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Air Quality Data</h1>
              <div className='inpage__introduction'>
                <p>We’re currently collecting data in 20 different countries and continuously adding more. We aggregate PM2.5, PM10, ozone (O3), sulfur dioxide (SO2), nitrogen dioxide (NO2), carbon monoxide (CO), and black carbon (BC). If you can’t find the location you’re looking for please suggest the source of send us an email.</p>
                <p><a href='#' className='button-inpage-download'>Download Daily Data - 2016/07/18 <small>(3MB)</small></a></p>
              </div>
            </div>
            <div className='inpage__actions'>
              <a href='' className='button-inpage-api'>API</a>
            </div>
          </div>
        </header>
        <div className='inpage__body'>
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

module.exports = connect(selector, dispatcher)(LocationsHub);
