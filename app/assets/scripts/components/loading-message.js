'use strict';
import React from 'react';

var LoadingMessage = React.createClass({
  displayName: 'LoadingMessage',

  propTypes: {
  },

  render: function () {
    return (
      <div className='data-loading-msg'>
        <svg version='1.1' className='wind-animated' viewBox='0 0 198 100' style={{enableBackground: 'new 0 0 198 100'}}>
          <path className='wind swirl-1' d='M56.1,41.8c0,0,41.1,0.2,43.8,0c2.6-0.2,8.2-1.9,8.5-7.6c0.3-6.3-4.6-9.3-8.5-9c-7.6,0.6-7.5,12.2,0.8,10.4' />
          <path className='wind swirl-2' d='M41.4,52.1c0,0,81.2,0.4,85.6,0c4.4-0.4,13.3-4.5,13.7-14c0.5-10.4-7.1-14.8-13.5-14.2C112,25.4,116.5,49,132,39.7'/>
          <path className='wind swirl-3' d='M81.6,62.6c0,0,59.5-0.4,62.8,0c3.1,0.4,8.2,1.2,8,7.8c-0.2,6.5-10.8,7.4-10.5,0.9'/>
        </svg>
        <p>Data is loading...</p>
      </div>
    );
  }
});

module.exports = LoadingMessage;
