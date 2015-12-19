import React from 'react';
import ReactIntl from 'react-intl';
import {getPrettyParameterName} from '../utils';
var actions = require('../actions/actions');

let {FormattedRelative, FormattedNumber, IntlMixin} = ReactIntl;

let Popup = React.createClass({

  mixins: [
    IntlMixin
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired,
    features: React.PropTypes.array.isRequired,
    parameter: React.PropTypes.string.isRequired
  },

  closePopup: function (e) {
    // Send out action
    actions.closeMapPopup();
  },

  /**
   * Main render function, draws everything
   */
  render: function () {
    let div = function (f) {
      return (
        <div>
          <div className='inner'>
            <div className='extra'><span>Location</span>: {f.properties.location}</div>
            <div className='extra'><span>Last Updated</span>: <FormattedRelative value={f.properties.lastUpdated} /></div>
            <div className='extra'><span>Value</span>: <FormattedNumber value={f.properties.value} /> {f.properties.unit}</div>
          </div>
          <div className='divider'></div>
        </div>
      );
    };

    let divs = [];
    for (let f of this.props.features) {
      divs.push(div(f));
    }

    return (
      <div className='map-popup'>
        <button onClick={this.closePopup}>x</button>
        <div className='title'>{getPrettyParameterName(this.props.parameter)}</div>
        {divs}
      </div>
    );
  }
});

module.exports = Popup;
