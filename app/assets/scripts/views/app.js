'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';

import { closeDownloadModal, closeVoteModal } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';
import HeaderMessage from '../components/header-message';
import ModalDownload from '../components/modal-download';
import ModalVote from '../components/modal-vote';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: React.PropTypes.array,
    baseDataReady: React.PropTypes.bool,
    baseDataError: React.PropTypes.string,
    measurements: React.PropTypes.number,
    downloadModal: React.PropTypes.object,
    voteModal: React.PropTypes.object,
    _closeDownloadModal: React.PropTypes.func,
    _closeVoteModal: React.PropTypes.func,
    children: React.PropTypes.object
  },

  onModalClose: function () {
    this.props._closeDownloadModal();
  },

  onVoteModalClose: function () {
    this.props._closeVoteModal();
  },

  render: function () {
    let pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    let content = (
      <HeaderMessage>
        <h2>Take a deep breath.</h2>
        <p>Air quality awesomeness is loading...</p>
      </HeaderMessage>
    );

    if (this.props.baseDataReady) {
      content = this.props.children;
    }

    if (this.props.baseDataError) {
      content = (
        <HeaderMessage>
          <h2>Uhoh, something went wrong</h2>
          <p>There was a problem getting the data. If the problem persists, please let us know.</p>
          <a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a>
        </HeaderMessage>
      );
    }

    return (
      <div className={c('page', pageClass)}>
        {this.props.voteModal.open ? (
          <ModalVote
            onModalClose={this.onVoteModalClose} />
        ) : null}
        <PageHeader routes={this.props.routes} />
        <main className='page__body' role='main'>
          {content}
        </main>
        {this.props.downloadModal.open ? (
          <ModalDownload
            country={this.props.downloadModal.country}
            area={this.props.downloadModal.area}
            location={this.props.downloadModal.location}
            onModalClose={this.onModalClose} />
        ) : null}
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

    measurements: state.baseStats.data.measurements,

    downloadModal: state.downloadModal,
    voteModal: state.voteModal
  };
}

function dispatcher (dispatch) {
  return {
    _closeDownloadModal: (...args) => dispatch(closeDownloadModal(...args)),
    _closeVoteModal: (...args) => dispatch(closeVoteModal(...args))
  };
}

module.exports = connect(selector, dispatcher)(App);

// module.exports = App;
