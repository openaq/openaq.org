'use strict';
import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const CHART_DEBUG = false;

var ChartMeasurement = React.createClass({
  displayName: 'ChartMeasurement',

  propTypes: {
    className: React.PropTypes.string,
    data: React.PropTypes.array,

    xRange: React.PropTypes.array,
    yRange: React.PropTypes.array,
    yLabel: React.PropTypes.string,
    compressed: React.PropTypes.bool
  },

  chart: null,

  onWindowResize: function () {
    this.chart.checkSize();
  },

  componentDidMount: function () {
    // console.log('ChartMeasurement componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = Chart();
    this.chart
      .data(this.props.data)
      .yLabel(this.props.yLabel)
      .xRange(this.props.xRange)
      .yRange(this.props.yRange);

    if (this.props.compressed) {
      this.chart.type('compressed');
    }

    d3.select(this.refs.container).call(this.chart);
  },

  componentWillUnmount: function () {
    // console.log('ChartMeasurement componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function (prevProps/* prevState */) {
    // console.log('ChartMeasurement componentDidUpdate');
    this.chart.pauseUpdate();
    if (prevProps.data !== this.props.data) {
      this.chart.data(this.props.data);
    }
    if (prevProps.yLabel !== this.props.yLabel) {
      this.chart.yLabel(this.props.yLabel);
    }
    if (prevProps.xRange !== this.props.xRange) {
      this.chart.xRange(this.props.xRange);
    }
    if (prevProps.yRange !== this.props.yRange) {
      this.chart.yRange(this.props.yRange);
    }
    if (prevProps.compressed !== this.props.compressed) {
      this.chart.type('compressed');
    }
    this.chart.continueUpdate();
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'></div>
    );
  }
});

module.exports = ChartMeasurement;

var Chart = function (options) {
  // Data related variables for which we have getters and setters.
  var _data = null;
  var _yLabel, _xRange, _yRange;

  // Pause
  var _pauseUpdate = false;

  // Containers
  var $el, $svg;
  // Var declaration.
  let margin = {top: 16, right: 32, bottom: 32, left: 48};

  // Colors suffix
  const indexSuffix = ['st', 'nd', 'rd'];

  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;

  // Update functions.
  var updateData, updateSize;

  // Variation of the chart
  var _type = 'normal';

  // X scale.
  var x = d3.scaleTime();
  // Y scale.
  var y = d3.scaleLinear();

  // Define xAxis function.
  var xAxis = d3.axisBottom(x)
    .tickPadding(8)
    .tickSize(0);
    // .tickFormat(d3.timeFormat('%H:%M'));
  // Define xAxis function.
  var yAxis = d3.axisLeft(y)
    .tickPadding(8)
    .ticks(5)
    .tickSize(0);

  function _calcSize () {
    _width = parseInt($el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt($el.style('height'), 10) - margin.top - margin.bottom;
  }

  function chartFn (selection) {
    $el = selection;

    var layers = {
      // Where the data is actually displayed.
      focusRegion: function () {
        // Append Focus Region.
        let focusR = $dataCanvas.selectAll('g.focus')
          .data([0]);

        let enter = focusR.enter().append('g')
          .attr('class', 'focus');

        if (CHART_DEBUG) {
          // Debug rectangle
          enter.append('rect')
            .attr('class', 'debug')
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', 'red')
            .attr('opacity', 0.2);

          focusR.select('rect.debug')
            .attr('width', _width)
            .attr('height', _height);
        }
      },

      focusData: function () {
        let $focus = $dataCanvas.select('g.focus');

        if (!_data) return;

        let focusDataGroups = $focus.selectAll('g.location-data')
          .data(_data);

        focusDataGroups.exit().remove();

        let circles = focusDataGroups.enter().append('g')
          .merge(focusDataGroups)
            .attr('class', (o, i) => `location-data location-data--${indexSuffix[i]}`)
            .selectAll('circle')
              .data(o => o);

        circles.exit().remove();

        circles.enter()
          .append('circle')
          .attr('r', _type === 'compressed' ? 2 : 4)
          .merge(circles)
            // `localNoTZ` is the measurement local date converted
            // directly to user local.
            .attr('cx', o => x(o.date.localNoTZ))
            .attr('cy', o => y(o.value));
      },

      xAxis: function () {
        // Append Axis.
        // X axis.
        let xAx = $svg.selectAll('.x.axis')
          .data([0]);

        xAx.enter().append('g')
          .attr('class', 'x axis')
          .append('text')
          .attr('class', 'label')
          .attr('text-anchor', 'start');

        xAx
          .attr('transform', `translate(${margin.left},${_height + margin.top + 8})`)
          .call(xAxis);
      },

      yAxis: function () {
        // Append yAxis.
        // Y axis.
        let yAx = $svg.selectAll('.y.axis')
          .data([0]);

        yAx.enter().append('g')
          .attr('class', 'y axis');

        yAx
          .attr('transform', `translate(${margin.left},${margin.top})`)
          .call(yAxis);

        // There's no straightforward way to add axix labels with line breaks,
        // so we need to append a new text element to the last tick.
        let ticks = yAx.selectAll('.tick');
        if (ticks.size()) {
          let lastTick = d3.select(ticks.nodes()[ticks.size() - 1]);
          let lastTickVal = lastTick.select('text');

          // The "last" axix changes according to the data so we need to remove
          // all the additional units before adding new ones.
          yAx.selectAll('.tick .unit').remove();

          lastTick.append('text')
            .attr('class', 'unit')
            .text(_yLabel)
            .attr('x', lastTickVal.attr('x'))
            .attr('y', lastTickVal.attr('y'))
            .attr('dy', '1.5em');
        }
      }
    };

    updateSize = function () {
      $svg
        .attr('width', _width + margin.left + margin.right)
        .attr('height', _height + margin.top + margin.bottom);

      $dataCanvas
        .attr('width', _width)
        .attr('height', _height);

      // Update Axis.
      if (_width <= 544) {
        xAxis.ticks(3);
      } else if (_width <= 768) {
        xAxis.ticks(5);
      } else {
        xAxis.ticks(15);
      }

      // Update scale ranges.
      x.range([0, _width]);
      y.range([_height, 0]);

      // Redraw.
      layers.focusRegion();
      layers.focusData();
      layers.xAxis();

      if (_type !== 'compressed') {
        layers.yAxis();
      }
    };

    updateData = function () {
      if (!_data || _pauseUpdate) {
        return;
      }

      // Update scale domains.
      x.domain(_xRange);
      y.domain(_yRange);

      // Redraw.
      layers.focusRegion();
      layers.focusData();
      layers.xAxis();

      if (_type !== 'compressed') {
        layers.yAxis();
      }
    };

    // -----------------------------------------------------------------
    // INIT.
    $svg = $el.append('svg')
      .attr('class', 'chart')
      .attr('width', 0)
      .attr('height', 0)
      .style('display', 'block');

    // Datacanvas
    var $dataCanvas = $svg.append('g')
      .attr('class', 'data-canvas')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    _calcSize();
    updateSize();
    updateData();
  }

  chartFn.checkSize = function () {
    _calcSize();
    updateSize();
    return chartFn;
  };

  chartFn.destroy = function () {
    // Cleanup.
  };

  chartFn.pauseUpdate = function () {
    _pauseUpdate = true;
    return chartFn;
  };

  chartFn.continueUpdate = function () {
    _pauseUpdate = false;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };
  // --------------------------------------------
  // Getters and setters.
  chartFn.data = function (d) {
    if (!arguments.length) return _data;
    _data = _.cloneDeep(d);
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.yLabel = function (d) {
    if (!arguments.length) return _yLabel;
    _yLabel = d;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.xRange = function (d) {
    if (!arguments.length) return _xRange;
    _xRange = d;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.yRange = function (d) {
    if (!arguments.length) return _yRange;
    _yRange = d;
    if (typeof updateData === 'function') updateData();
    return chartFn;
  };

  chartFn.type = function (d) {
    if (!arguments.length) return _type;
    _type = d;
    if (_type === 'compressed') {
      margin = Object.assign({}, margin, {
        left: 16
      });
    }
    if (typeof updateSize === 'function') updateSize();
    return chartFn;
  };

  return chartFn;
};
