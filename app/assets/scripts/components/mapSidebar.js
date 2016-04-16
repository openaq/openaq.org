import React from 'react';
import ReactIntl from 'react-intl';
import classNames from 'classnames';

let { IntlMixin } = ReactIntl;

import Cell from './mapSidebarCell';

let Sidebar = React.createClass({

  mixins: [
    IntlMixin
  ],

  getInitialState: function () {
    return {
      displayed: false
    };
  },

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired,
    features: React.PropTypes.array.isRequired
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      displayed: this.state.displayed || nextProps.features.length >= 1
    });
  },

  _closeSidebar: function (e) {
    e.preventDefault();
    this.setState({
      displayed: false
    });
  },

  /**
   * Main render function, draws everything
   */
  render: function () {
    let sidebarClass = classNames('map-sidebar', this.state.displayed ? 'open' : 'closed');
    let noResultsClass = classNames('no-results', this.props.features.length === 0 ? 'shown' : 'hidden');

    return (
      <div className={sidebarClass}>
        <a href='#' onClick={this._closeSidebar} id='close-button' title='Close'><span className='collecticon collecticon-chevron-left'></span></a>
        <div className={noResultsClass}>
          Oops, there are no results for your current location and parameter, try
          clicking on a new area or selecting a new paramter.
        </div>
        <div className='results-pane'>
          {this.props.features.map((f, i) =>
            <Cell locales={this.props.locales} messages={this.props.messages} key={i} feature={f} />
          )}
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
