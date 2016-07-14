'use strict';
import React from 'react';
import _ from 'lodash';
import c from 'classnames';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: React.PropTypes.array,
    children: React.PropTypes.object
  },

  render: function () {
    let pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <PageHeader />
        <main className='page__body' role='main'>
          {this.props.children}
        </main>
        <PageFooter />
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

// function selector (state) {
//   return {
//   };
// }

// function dispatcher (dispatch) {
//   return {
//   };
// }

// module.exports = connect(selector, dispatcher)(App);

module.exports = App;
