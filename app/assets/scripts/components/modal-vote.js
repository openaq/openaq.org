'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import c from 'classnames';
import OpenAQ from 'openaq-design-system';
const { Modal, ModalHeader, ModalBody } = OpenAQ.Modal;
import createReactClass from 'create-react-class';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var ModalVote = createReactClass({
  displayName: 'ModalVote',

  propTypes: {
    onModalClose: T.func
  },

  //
  // Render Methods
  //

  render: function () {
    return (
      <Modal
        id='modal-vote'
        className='modal--medium'
        onCloseClick={this.props.onModalClose}
        revealed >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'>The Open Science Prize Vote ends on Friday, Jan 6! Have you voted?</h1>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className='prose'>
            <p className='modal__description'>Hello, OpenAQ Community! We hope this find you well and building all kinds of cool stuff with open air quality data.</p>
            <p className='modal__description'>Sorry to bother you, but please consider voting in the <a href='https://www.openscienceprize.org/' target='_blank'>Open Science Prize</a> competition that we're a finalist in, along with several other awesome open science projects.</p>
            <p className='modal__description'>Your vote supports open data, open science and open-source work. This message will disappear after January 6th, when the competition closes.</p>
            <form className='form form-vote'>
              <div className='form__actions'>
                <button type='button' className='button button--primary-bounded' onClick={this.props.onModalClose}>Dismiss</button>
                <a href='http://event.capconcorp.com/wp/osp/vote-now/' onClick={this.props.onModalClose} className={c('button-modal-vote', {disabled: false})} target='_blank'>I'll Vote!</a>
              </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {};
}

function dispatcher (dispatch) {
  return {};
}

module.exports = connect(selector, dispatcher)(ModalVote);
