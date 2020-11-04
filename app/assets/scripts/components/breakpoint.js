'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

export const RANGE_MATRIX = {
  xsmall: [0, 543],
  small: [544, 767],
  medium: [768, 991],
  large: [992, 1199],
  xlarge: [1200, Infinity]
};

class Breakpoint extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.getBreakpoints();

    this.resizeListener = this.resizeListener.bind(this);
  }

  getBreakpoints () {
    const width = document.body.offsetWidth;
    let ranges = {};
    for (const name in RANGE_MATRIX) {
      if (RANGE_MATRIX.hasOwnProperty(name)) {
        const [min, max] = RANGE_MATRIX[name];
        ranges[`${name}Down`] = width <= max;
        ranges[`${name}Only`] = width >= min && width <= max;
        ranges[`${name}Up`] = width >= min;
      }
    }
    return ranges;
  }

  resizeListener () {
    this.setState(this.getBreakpoints());
  }

  componentDidMount () {
    window.addEventListener('resize', this.resizeListener);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize);
  }

  render () {
    return this.props.children(this.state);
  }
}

if (environment !== 'production') {
  Breakpoint.propTypes = {
    children: T.func.isRequired
  };
}

export default Breakpoint;
