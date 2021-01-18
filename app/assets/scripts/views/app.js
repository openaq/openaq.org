'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, matchPath } from 'react-router-dom';
import c from 'classnames';

import { closeDownloadModal as closeDownloadModalAction } from '../actions/action-creators';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';
import ModalDownload from '../components/modal-download/';

function App(props) {
  const { children, location, downloadModal, closeDownloadModal } = props;

  const pageClass = children.props.children.find(child => {
    const match = matchPath(location.pathname, {
      path: child.props.path,
    });
    return match && match.isExact;
  }).props.pageClass;

  return (
    <div className={c('page', pageClass)}>
      <PageHeader />
      <main className="page__body" role="main">
        {children}
      </main>
      {downloadModal.open && (
        <ModalDownload
          downloadType={downloadModal.downloadType}
          country={downloadModal.country}
          area={downloadModal.area}
          location={downloadModal.location}
          project={downloadModal.project}
          onModalClose={closeDownloadModal}
          revealed={downloadModal.open}
        />
      )}
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
