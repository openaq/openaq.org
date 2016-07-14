'use strict';
import React from 'react';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
  },

  render: function () {
    return (
      <header className='page__header' role='banner'>
        <div className='inner'>
          <div className='page__headline'>
            <h1 className='page__title'><a href='/' title='Visit homepage'>OpenAQ</a></h1>
          </div>
          {/* <nav className='page__prime-nav'>
            <div className='menu-wrapper'>
              <ul className='menu'>
                <li>item</li>
                <li>item</li>
                <li>item</li>
              </ul>
            </div>
          </nav> */}
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
