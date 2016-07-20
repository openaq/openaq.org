'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: React.PropTypes.array,
    baseDataReady: React.PropTypes.bool,
    children: React.PropTypes.object
  },

  render: function () {
    let pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    let content = (
      <div>Preparing the site for you!</div>
    );
    if (this.props.baseDataReady) {
      content = this.props.children;
    }

    return (
      <div className={c('page', pageClass)}>
        <PageHeader />
        <main className='page__body' role='main'>
          {content}
        </main>
        <PageFooter />
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    baseDataReady: state.baseData.fetched && !state.baseData.fetching
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(App);

// module.exports = App;
