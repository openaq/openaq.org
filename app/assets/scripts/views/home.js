'use strict';
import React from 'react';
import { connect } from 'react-redux';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div>
        <h1>OpenAQ</h1>
        Hello OpenAQ
      </div>
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

module.exports = connect(selector, dispatcher)(Home);
