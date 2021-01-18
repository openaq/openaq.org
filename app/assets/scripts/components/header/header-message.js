'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import createReactClass from 'create-react-class';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var HeaderMessage = createReactClass({
  displayName: 'HeaderMessage',

  propTypes: {
    children: T.array,
  },

  render: function () {
    return (
      <section className="general-message">
        <div className="inner">{this.props.children}</div>
      </section>
    );
  },
});

module.exports = HeaderMessage;
