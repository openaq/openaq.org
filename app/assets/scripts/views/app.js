'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router-dom';
import c from 'classnames';

import { closeDownloadModal as closeDownloadModalAction } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';
import ModalDownload from '../components/modal-download';

function App(props) {
  let pageClass = props.children.props.children.find(child => {
    const match = matchPath(props.location.pathname, {
      path: child.props.path,
    });
    return match && match.isExact;
  }).props.pageClass;
  return (
    <div className={c('page', pageClass)}>
      <PageHeader />
      <main className="page__body" role="main">
        {props.children}
      </main>
      {props.downloadModal.open ? (
        <ModalDownload
          country={props.downloadModal.country}
          area={props.downloadModal.area}
          location={props.downloadModal.location}
          onModalClose={props.closeDownloadModal}
        />
      ) : null}
      <PageFooter measurements={null} />
    </div>
  );
}

App.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,

  downloadModal: PropTypes.object.isRequired,
  closeDownloadModal: PropTypes.func.isRequired,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    downloadModal: state.downloadModal,
  };
}

function dispatcher(dispatch) {
  return {
    closeDownloadModal: (...args) =>
      dispatch(closeDownloadModalAction(...args)),
  };
}

module.exports = connect(selector, dispatcher)(withRouter(App));
