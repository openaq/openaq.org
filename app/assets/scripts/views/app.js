'use strict';
import React from 'react';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='page-content'>
        {this.props.children}
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

// function selector (state) {
//   return {
//   };
// }

// function dispatcher (dispatch) {
//   return {
//   };
// }

// module.exports = connect(selector, dispatcher)(App);

module.exports = App;
