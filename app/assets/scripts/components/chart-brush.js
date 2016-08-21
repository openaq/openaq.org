'use strict';
import React from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

const CHART_DEBUG = false;

// Resources:
// Brush & Zoom
//  http://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172
// D3 Advanced Brush Style - Part 5
//  http://bl.ocks.org/jisaacks/5678983

var BrushChart = React.createClass({
  displayName: 'BrushChart',

  propTypes: {
    className: React.PropTypes.string,
    data: React.PropTypes.array,

    xRange: React.PropTypes.array,
    yRange: React.PropTypes.array,
    yLabel: React.PropTypes.string
  },

  chart: null,

  onWindowResize: function () {
    this.chart.checkSize();
  },

  componentDidMount: function () {
    // console.log('BrushChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = Chart();
    this.chart
      .data(this.props.data)
      .yLabel(this.props.yLabel)
      .xRange(this.props.xRange)
      .yRange(this.props.yRange);

    d3.select(this.refs.container).call(this.chart);
  },

  componentWillUnmount: function () {
    // console.log('BrushChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function (prevProps/* prevState */) {
    // console.log('BrushChart componentDidUpdate');
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
    this.chart.continueUpdate();
  },

  render: function () {
    return (
      <div className={this.props.className} ref='container'></div>
    );
  }
});

module.exports = BrushChart;

var Chart = function (options) {
  // Data related variables for which we have getters and setters.
  var _data = null;
  var _yLabel, _xRange, _yRange;

  // Pause
  var _pauseUpdate = false;

  // Containers
  var $el, $svg;
  // Var declaration.
  const margin = {top: 16, right: 32, bottom: 32, left: 48};

  const calcFocusHeight = () => _height * 0.70;
  const calcContextYPos = () => calcFocusHeight() + 32;
  const calcContextHeight = () => _height - calcContextYPos();

  // Colors suffix
  const indexSuffix = ['st', 'nd', 'rd'];

  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;

  // Update functions.
  var updateData, upateSize;

  // X scale.
  var x = d3.scaleTime();
  // Y scale.
  var y = d3.scaleLinear();

  // X scale for brush.
  var xBrush = d3.scaleTime();
  // Y scale for brush.
  var yBrush = d3.scaleLinear();

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

  // Define xAxis brush function.
  var xAxisBrush = d3.axisBottom(xBrush)
    .tickPadding(8)
    .tickSize(0);

  var brush = d3.brushX().handleSize(8);

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
          .attr('class', 'focus')
          .attr('clip-path', 'url(#clip)');

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
            .attr('height', calcFocusHeight());
        }
      },

      // The area for the brush.
      contextRegion: function () {
        // Append Focus Region. Where the data is actually displayed.
        let contextR = $dataCanvas.selectAll('g.context')
          .data([0]);

        let enter = contextR.enter().append('g')
          .attr('class', 'context');

        if (CHART_DEBUG) {
          // Debug rectangle
          enter.append('rect')
            .attr('class', 'debug')
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', 'green')
            .attr('opacity', 0.2);

          contextR.select('rect.debug')
            .attr('width', _width)
            .attr('height', calcContextHeight());
        }

        contextR
          .attr('transform', `translate(${0},${calcContextYPos()})`);
      },

      contextData: function () {
        let $context = $dataCanvas.select('g.context');

        let dataContainer = $context.selectAll('g.data').data([0]);
        dataContainer
          .enter().append('g')
            .attr('class', 'data');

        if (!_data) return;

        let contextDataGroups = dataContainer.selectAll('g.location-data')
          .data(_data);

        contextDataGroups.exit().remove();

        let circles = contextDataGroups.enter().append('g')
          .merge(contextDataGroups)
            .attr('class', (o, i) => `location-data location-data--${indexSuffix[i]}`)
            .selectAll('circle')
              .data(o => o);

        circles.exit().remove();

        circles.enter()
          .append('circle')
          .attr('r', 3)
          .merge(circles)
            // `localNoTZ` is the measurement local date converted
            // directly to user local.
            .attr('cx', o => xBrush(o.date.localNoTZ))
            .attr('cy', o => yBrush(o.value));
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
          .attr('r', 3)
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
          .attr('transform', `translate(${margin.left},${calcFocusHeight() + margin.top + 8})`)
          .call(xAxis);
      },

      xAxisBrush: function () {
        // Append xAxisBrush.
        // X axis brush.
        let xAx = $svg.selectAll('.x.axis-brush')
          .data([0]);

        xAx.enter().append('g')
          .attr('class', 'x axis axis-brush')
          .append('text')
          .attr('class', 'label')
          .attr('text-anchor', 'start');

        xAx
          .attr('transform', `translate(${margin.left},${_height + margin.top + 8})`)
          .call(xAxisBrush);
      },

      yAxis: function () {
        // Append yAxis.
        // Y axis.
        let yAx = $svg.selectAll('.y.axis')
          .data([0]);

        yAx.enter().append('g')
          .attr('class', 'y axis')
          .append('text')
          .attr('class', 'label')
          .attr('text-anchor', 'end')
          .attr('dy', '16px')
          .attr('transform', 'rotate(-90)');

        yAx.select('.label')
          .text(_yLabel);

        yAx
          .attr('transform', `translate(${margin.left},${margin.top})`)
          .call(yAxis);
      },

      brush: function () {
        let contextR = $dataCanvas.select('g.context');

        if (contextR.select('g.brush').empty()) {
          contextR.append('g')
          .attr('class', 'brush')
          .call(brush)
          .call(brush.move, x.range());
        }

        contextR.selectAll('.brush .handle')
          .attr('fill', '#496A90')
          .attr('height', calcContextHeight() * 0.5)
          .attr('y', calcContextHeight() * 0.25);
      }
    };

    upateSize = function () {
      $svg
        .attr('width', _width + margin.left + margin.right)
        .attr('height', _height + margin.top + margin.bottom);

      $dataCanvas
        .attr('width', _width)
        .attr('height', _height);

      $svg.select('#clip rect')
        // The 8 and the 16 are to add some top and bottom space to
        // avoid clipping the data.
        .attr('x', 0)
        .attr('y', -8)
        .attr('width', _width)
        .attr('height', calcFocusHeight() + 16);

      if (CHART_DEBUG) {
        // To view the area taken by the #clip rect.
        $dataCanvas.select('.data-canvas-shadow')
          .attr('x', 0)
          .attr('y', -8)
          .attr('width', _width)
          .attr('height', calcFocusHeight() + 16);
      }

      // Update scale ranges.
      x.range([0, _width]);
      xBrush.range([0, _width]);
      y.range([calcFocusHeight(), 0]);
      yBrush.range([calcContextHeight(), 0]);

      // Update brush.
      // HACK-ish way of covering all the points. FIX!
      brush.extent([[0, -4], [_width, calcContextHeight() + 8]]);
      $dataCanvas.select('g.brush')
        .call(brush)
        .call(brush.move, x.range());

      // Redraw.
      layers.contextRegion();
      layers.contextData();
      layers.focusRegion();
      layers.focusData();
      layers.xAxis();
      layers.xAxisBrush();
      layers.yAxis();
      layers.brush();
    };

    updateData = function () {
      if (!_data || _pauseUpdate) {
        return;
      }

      // Update scale domains.
      x.domain(_xRange);
      xBrush.domain(_xRange);
      y.domain(_yRange);
      yBrush.domain(_yRange);

      // Redraw.
      layers.contextRegion();
      layers.contextData();
      layers.focusRegion();
      layers.focusData();
      layers.xAxis();
      layers.xAxisBrush();
      layers.yAxis();
      layers.brush();
    };

    // -----------------------------------------------------------------
    // INIT.
    $svg = $el.append('svg')
      .attr('class', 'chart')
      .style('display', 'block');

    // Datacanvas
    var $dataCanvas = $svg.append('g')
      .attr('class', 'data-canvas')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    $svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect');

    if (CHART_DEBUG) {
      // To view the area taken by the #clip rect.
      $dataCanvas.append('rect')
        .attr('class', 'data-canvas-shadow')
        .style('fill', '#000')
        .style('opacity', 0.16);
    }

    brush.on('brush end start', function () {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom

      let s = d3.event.selection || xBrush.range();
      let newXDomain = s.map(xBrush.invert);
      // Compute new yMax.
      let yMax = _(_data)
        .map(l => {
          let max = _(l)
            .filter(m => m.date.localNoTZ >= newXDomain[0] && m.date.localNoTZ <= newXDomain[1])
            .maxBy('value');

          return max ? max.value : 0;
        })
        .max();

      x.domain(newXDomain);
      y.domain([0, yMax]);

      // Redraw.
      layers.focusRegion();
      layers.focusData();
      layers.xAxis();
      layers.yAxis();
      layers.brush();
    });

    _calcSize();
    upateSize();
    updateData();
  }

  chartFn.checkSize = function () {
    _calcSize();
    upateSize();
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

  return chartFn;
};
