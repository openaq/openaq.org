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
  propTypes: {
    parameter: React.PropTypes.string.isRequired,
    data: React.PropTypes.object.isRequired
  },
  /**
   * Handler for switching of the selected paramter, updates state and data
   * @param {object} e associated event
   */
  _handleParamSwitch: function (e) {
    mapParameterChanged({parameter: e.value});
  },

  render: function () {
    const colorScale = generateColorScale(this.props.data.features, parameterMax[this.props.parameter]);
    // Do nothing if we don't have a color scale
    if (!colorScale || !colorScale(0)) {
      return (<div></div>);
    }

    const options = [
      {value: 'pm25', label: getPrettyParameterName('pm25')},
      {value: 'pm10', label: getPrettyParameterName('pm10')},
      {value: 'o3', label: getPrettyParameterName('o3')},
      {value: 'no2', label: getPrettyParameterName('no2')},
      {value: 'so2', label: getPrettyParameterName('so2')},
      {value: 'co', label: getPrettyParameterName('co')}
    ];
    const defaultOption = {label: getPrettyParameterName(this.props.parameter)};

    return (
      <div className='legend-outer'>
        <div className='legend-title'>Showing values for <Dropdown options={options} onChange={this._handleParamSwitch} value={defaultOption} /></div>
        <div className='map-legend'>
          <ul>
            {colorScale.range().map((s, i) => {
              // Add a plus sign to indicate higher values for last item
              let text = colorScale.invertExtent(s)[0];
              text = (text < 1 && text !== 0) ? text.toFixed(2) : text.toFixed();
              text = (i === colorScale.range().length - 1) ? text += '+' : text;
              text = (i === 0) ? text += ` ${parameterUnit[this.props.parameter]}` : text;
              return <li key={i} className='legend-item' style={{borderTopColor: s}}>{text}</li>;
            })}
          </ul>
        </div>
        <div className='legend-info'>Recent PM2.5, PM10, Ozone, NO<sub>2</sub>, SO<sub>2</sub>, and CO data from official sources. Values older than 24hrs are displayed in gray.</div>
      </div>
    );
  }
});

export default MapLegend;
