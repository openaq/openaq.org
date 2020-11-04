'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import createReactClass from 'create-react-class';

var HeaderMessage = createReactClass({
  displayName: 'HeaderMessage',

  propTypes: {
    children: T.array
  },

  render: function () {
    return (
      <section className='general-message'>
        <div className='inner'>
          {this.props.children}
        </div>
      </section>
    );
  }
});

module.exports = HeaderMessage;
