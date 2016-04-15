'use strict';

var React = require('react');
import Reflux from 'reflux';
import { createClass } from 'react';
import Dropdown from 'react-dropdown';

import latestStore from '../stores/latest';
import { generateColorScale, getPrettyParameterName } from '../utils';
import { latestValuesLoaded, mapParameterChanged } from '../actions/actions';
import { parameterMax, parameterUnit } from '../components/mapConfig';

/**
 * Small legend component for map
 */
const MapLegend = createClass({
  mixins: [
    Reflux.listenTo(latestValuesLoaded, '_handleData'),
    Reflux.listenTo(mapParameterChanged, '_handleData')
  ],

  getInitialState: function () {
    return {
      data: [],
      selectedParameter: 'pm25'
    };
  },

  _handleData: function (data) {
    if (data && data.parameter) {
      this.setState({
        selectedParameter: data.parameter,
        data: latestStore.storage.hasGeo[this.state.selectedParameter]
      });
    } else {
      this.setState({
        data: latestStore.storage.hasGeo[this.state.selectedParameter]
      });
    }
  },

  /**
   * Handler for switching of the selected paramter, updates state and data
   * @param {object} e associated event
   */
  _handleParamSwitch: function (e) {
    mapParameterChanged({parameter: e.value});
  },

  render: function () {
    const colorScale = generateColorScale(this.state.data, parameterMax[this.state.selectedParameter]);
    // Do nothing if we don't have a color scale
    if (!colorScale(0)) {
      return (<div></div>);
    }

    const options = [
      {value: 'pm25', label: getPrettyParameterName('pm25')},
      {value: 'pm10', label: getPrettyParameterName('pm10')},
      {value: 'o3', label: getPrettyParameterName('o3')},
      {value: 'co', label: getPrettyParameterName('co')},
      {value: 'so2', label: getPrettyParameterName('so2')},
      {value: 'no2', label: getPrettyParameterName('no2')},
      {value: 'bc', label: getPrettyParameterName('bc')}
    ];
    const defaultOption = {label: getPrettyParameterName(this.state.selectedParameter)};

    return (
      <div className='legend-outer'>
        <div className='legend-title'>Showing values for <Dropdown options={options} onChange={this._handleParamSwitch} value={defaultOption} /> in {parameterUnit[this.state.selectedParameter]}.</div>
        <div className='map-legend'>
          <ul>
            {colorScale.range().map((s, i) => {
              // Add a plus sign to indicate higher values for last item
              let text = colorScale.invertExtent(s)[0];
              text = (text < 1 && text !== 0) ? text.toFixed(2) : text.toFixed();
              text = (i === colorScale.range().length - 1) ? text += '+' : text;
              return <li key={i} className='legend-item' style={{borderTopColor: s}}>{text}</li>;
            })}
          </ul>
        </div>
        <div className='legend-info'>Only values for the last 24 hours are displayed, older values are greyed out.</div>
      </div>
    );
  }
});

export default MapLegend;
