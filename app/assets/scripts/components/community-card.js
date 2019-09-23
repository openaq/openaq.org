'use strict';
import React from 'react';

var CommunityCard = React.createClass({
  displayName: 'CommunityCard',

  propTypes: {
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    location: React.PropTypes.string,
    linkTitle: React.PropTypes.string,
    url: React.PropTypes.string,
    imageNode: React.PropTypes.node,
    logo: React.PropTypes.string,
    horizontal: React.PropTypes.bool,
    children: React.PropTypes.object
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
