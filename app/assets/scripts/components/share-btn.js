'use strict';
import React from 'react';
import { Dropdown } from 'openaq-design-system';

var ShareBtn = React.createClass({
  displayName: 'ShareBtn',

  propTypes: {
  },

  render: function () {

    var encodedURl = encodeURIComponent("https://openaq.org/#/compare/JOHN/40GK09%20-%20GENK?parameter=pm25&_k=27lnfl");

    return (
      <Dropdown
        triggerElement='button'
        triggerClassName='button-inpage-share'
        triggerTitle='Show/hide share options'
        triggerText='Share' >

        <ul role='menu' className='drop__menu drop__menu--select'>
          <li><a className='drop__menu-item share-opt-twitter' href={`https://twitter.com/share?url=${window.location.url}`} target='_blank' title='Share on twitter' data-hook='dropdown:close'><span>Twitter</span></a></li>
          <li><a className='drop__menu-item share-opt-facebook' href={`http://facebook.com/sharer.php?u=${encodedURl}`} target='_blank' title='Share on Facebook' data-hook='dropdown:close'><span>Facebook</span></a></li>
        </ul>
      </Dropdown>
    );
  }
});

module.exports = ShareBtn;
