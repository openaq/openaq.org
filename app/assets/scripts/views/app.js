'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';
import HeaderMessage from '../components/header-message';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: React.PropTypes.array,
    baseDataReady: React.PropTypes.bool,
    baseDataError: React.PropTypes.string,
    measurements: React.PropTypes.number,
    children: React.PropTypes.object
  },

  render: function () {
    let pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    let content = (
      <HeaderMessage>
        <h2>Take a deep breath.</h2>
        <p>Air quality measurements loading...</p>
      </HeaderMessage>
    );

    if (this.props.baseDataReady) {
      content = this.props.children;
    }

    if (this.props.baseDataError) {
      content = (
        <HeaderMessage>
          <h2>Uhoh, something went wrong</h2>
          <p>There was a problem getting the data. If the problem persists let us know.</p>
          <a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a>
        </HeaderMessage>
      );
    }

    return (
      <div className={c('page', pageClass)}>
        <PageHeader />
        <main className='page__body' role='main'>
          {content}
        </main>
        <PageFooter measurements={this.props.measurements} />
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    baseDataReady: state.baseData.fetched && !state.baseData.fetching,
    baseDataError: state.baseData.error,

    measurements: state.baseStats.data.measurements
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(App);

// module.exports = App;
