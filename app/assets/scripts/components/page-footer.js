'use strict';
import React from 'react';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  propTypes: {
  },

  render: function () {
    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <p>Made with love by <a href='https://developmentseed.org' title='Visit Development Seed website'>Development Seed</a> and <a href='https://openaq.org/' title='Visit the OpenAQ website'>OpenAQ</a>.</p>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
