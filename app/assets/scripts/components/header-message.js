'use strict';
import React from 'react';

var HeaderMessage = React.createClass({
  displayName: 'HeaderMessage',

  propTypes: {
    children: React.PropTypes.array
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
