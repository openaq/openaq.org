'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router-dom';
import c from 'classnames';
import createReactClass from 'create-react-class';

import { closeDownloadModal } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import NewsBanner from '../components/news-banner';
import PageFooter from '../components/page-footer';
import { HeaderMessage } from '../components/header';
import ModalDownload from '../components/modal-download';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var App = createReactClass({
  displayName: 'App',

  propTypes: {
    location: T.object,
    baseDataReady: T.bool,
    baseDataError: T.string,
    measurements: T.number,
    downloadModal: T.object,
    _closeDownloadModal: T.func,
    children: T.object,
  },

  onModalClose: function () {
    this.props._closeDownloadModal();
  },

  render: function () {
    let pageClass = this.props.children.props.children.find(child => {
      const match = matchPath(this.props.location.pathname, {
        path: child.props.path,
      });
      return match && match.isExact;
    }).props.pageClass;

    let content = (
      <HeaderMessage>
        <h1>Take a deep breath.</h1>
        <div className="prose prose--responsive">
          <p>Air quality awesomeness is loading...</p>
        </div>
      </HeaderMessage>
    );

    if (this.props.baseDataReady) {
      content = this.props.children;
    }

    if (this.props.baseDataError) {
      content = (
        <HeaderMessage>
          <h1>Uhoh, something went wrong</h1>
          <div className="prose prose--responsive">
            <p>
              There was a problem getting the data. If the problem persists,
              please let us know.
            </p>
            <p>
              <a href="mailto:info@openaq.org" title="Send us an email">
                Send us an Email
              </a>
            </p>
          </div>
        </HeaderMessage>
      );
    }

    return (
      <div className={c('page', pageClass)}>
        <PageHeader />
        <NewsBanner />
        <main className="page__body" role="main">
          {content}
        </main>
        {this.props.downloadModal.open ? (
          <ModalDownload
            country={this.props.downloadModal.country}
            area={this.props.downloadModal.area}
            location={this.props.downloadModal.location}
            onModalClose={this.onModalClose}
          />
        ) : null}
        <PageFooter measurements={this.props.measurements} />
      </div>
    );
  },
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    baseDataReady: state.baseData.fetched && !state.baseData.fetching,
    baseDataError: state.baseData.error,

    measurements: state.baseData.data.totalMeasurements,

    downloadModal: state.downloadModal,
  };
}

function dispatcher(dispatch) {
  return {
    _closeDownloadModal: (...args) => dispatch(closeDownloadModal(...args)),
  };
}

module.exports = connect(selector, dispatcher)(withRouter(App));

// module.exports = App;
