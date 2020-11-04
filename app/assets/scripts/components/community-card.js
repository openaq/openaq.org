'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import createReactClass from 'create-react-class';

var CommunityCard = createReactClass({
  displayName: 'CommunityCard',

  propTypes: {
    title: T.string,
    type: T.string,
    location: T.string,
    linkTitle: T.string,
    url: T.string,
    imageNode: T.node,
    logo: T.string,
    horizontal: T.bool,
    children: T.object
  },

  getDefaultProps: function () {
    return {
      horizontal: false
    };
  },

  render: function () {
    return (
      <li>
        <article className='card card--project'>
          <a href={this.props.url} className='card__contents' title='View project'>
            <header className='card__header'>
              <div className='card__headline'>
                <p className='card__subtitle'>{this.props.type || 'N/A'}</p>
                <h1 className='card__title'>{this.props.title}</h1>
              </div>
            </header>
            <div className='card__body'>
              {this.props.children}
            </div>
            <footer className='card__footer'>
              <p className='card__footer-detail'>{this.props.location || 'N/A'}</p>
              {this.props.logo && <img src={this.props.logo} alt='Project logo' />}
            </footer>
          </a>
        </article>
      </li>
    );
  }
});

module.exports = CommunityCard;
