'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import createReactClass from 'create-react-class';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
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
