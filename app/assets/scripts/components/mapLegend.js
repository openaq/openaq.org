'use strict';

var React = require('react');
import Reflux from 'reflux';
import { createClass } from 'react';

import latestStore from '../stores/latest';
import { generateColorScale } from '../utils';
import { latestValuesLoaded, mapParameterChanged } from '../actions/actions';
import { parameterMax } from '../components/mapConfig';

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

  render: function () {
    const colorScale = generateColorScale(this.state.data, parameterMax[this.state.selectedParameter]);
    // Do nothing if we don't have a color scale
    if (!colorScale(0)) {
      return (<div></div>);
    }

    return (
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
    );
  }
});

export default MapLegend;
