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
          <div className='extra'>Source: <a href='#'>source</a></div>
        </div>
        <div className='divider'></div>
      </div>
    );
  }
});

module.exports = Cell;
