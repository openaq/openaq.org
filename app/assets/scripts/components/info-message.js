'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import createReactClass from 'create-react-class';

var InfoMessage = createReactClass({
  displayName: 'InfoMessage',

  propTypes: {
    children: T.array
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
