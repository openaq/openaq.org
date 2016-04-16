'use strict';

import { getCSVURL } from '../utils';
import metadataStore from '../stores/metadata';

import React from 'react';
import ReactIntl from 'react-intl';

let {FormattedRelative, FormattedNumber, IntlMixin} = ReactIntl;

let Cell = React.createClass({

  mixins: [
    IntlMixin
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired,
    feature: React.PropTypes.object.isRequired
  },

  _getSourceURL: function (location) {
    return metadataStore.storage.sourceURLs[location];
  },

  /**
   * Main render function, draws everything
   */
  render: function () {
    let f = this.props.feature.properties;
    if (!f.lastUpdated) { return null; } // TODO: Fix this?
    return (
      <div className='map-sidebar-cell'>
        <div className='inner'>
          <div className='title'>{f.location}</div>
          <div className='extra'><FormattedNumber value={f.value} /> {f.unit}</div>
          <div className='extra'><FormattedRelative value={f.lastUpdated} /></div>
          <div className='links'>
            <a href={getCSVURL(f.location)} title='Download CSV of recent data for location'><span className='collecticon collecticon-download'></span></a>
            <a href={this._getSourceURL(f.location)} target='_blank' title='Go to source data for location'><span className='collecticon collecticon-expand-top-right'></span></a>
          </div>
        </div>
        <div className='divider'></div>
      </div>
    );
  }
});

module.exports = Cell;
