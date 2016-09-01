'use strict';
import React from 'react';

var InfoMessage = React.createClass({
  displayName: 'InfoMessage',

  propTypes: {
    children: React.PropTypes.array
  },

  render: function () {
    return (
      <div className='info-msg'>
        <div className='info-msg__contents'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = InfoMessage;
