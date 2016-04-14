import React from 'react';
import ReactIntl from 'react-intl';
import {getPrettyParameterName} from '../utils';
import classNames from 'classnames';
import actions from '../actions/actions';

let { IntlMixin } = ReactIntl;

import Cell from './mapSidebarCell';

let Sidebar = React.createClass({

  mixins: [
    IntlMixin
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired,
    features: React.PropTypes.array.isRequired,
    parameter: React.PropTypes.string.isRequired,
    displaySidebar: React.PropTypes.bool.isRequired
  },

  _closeSidebar: function (e) {
    // Send out action
    actions.closeMapSidebar();
  },

  /**
   * Handler for switching of the selected paramter, updates state and data
   * @param {object} e associated event
   */
  _handleParamSwitch: function (e) {
    actions.mapParameterChanged({parameter: e.target.value});
  },

  /**
   * Main render function, draws everything
   */
  render: function () {
    let sidebarClass = classNames('map-sidebar', this.props.displaySidebar ? 'shown' : 'hidden');
    let noResultsClass = classNames('no-results', this.props.features.length === 0 ? 'shown' : 'hidden');
    return (
      <div className={sidebarClass}>
        <div className='sidebar-tab' onClick={this._closeSidebar}>{this.props.parameter.toUpperCase()}</div>
        <div className='selector'>
          <div className='title'>Selected Paramter</div>
          <label><input type='radio' name='paramSwitcher' value='pm25' onChange={this._handleParamSwitch} checked={this.props.parameter === 'pm25'} />{getPrettyParameterName('pm25')}</label>
          <label><input type='radio' name='paramSwitcher' value='pm10' onChange={this._handleParamSwitch} checked={this.props.parameter === 'pm10'} />{getPrettyParameterName('pm10')}</label><br/>
          <label><input type='radio' name='paramSwitcher' value='o3' onChange={this._handleParamSwitch} checked={this.props.parameter === 'o3'} />{getPrettyParameterName('o3')}</label>
          <label><input type='radio' name='paramSwitcher' value='so2' onChange={this._handleParamSwitch} checked={this.props.parameter === 'so2'} />{getPrettyParameterName('so2')}</label><br/>
          <label><input type='radio' name='paramSwitcher' value='no2' onChange={this._handleParamSwitch} checked={this.props.parameter === 'no2'} />{getPrettyParameterName('no2')}</label>
          <label><input type='radio' name='paramSwitcher' value='co' onChange={this._handleParamSwitch} checked={this.props.parameter === 'co'} />{getPrettyParameterName('co')}</label>
        </div>
        <div className='header-divider'></div>
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
