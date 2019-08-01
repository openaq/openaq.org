'use strict';
import React from 'react';
import c from 'classnames';

var CommunityCard = React.createClass({
  displayName: 'CommunityCard',

  propTypes: {
    title: React.PropTypes.string,
    linkTitle: React.PropTypes.string,
    url: React.PropTypes.string,
    imageNode: React.PropTypes.node,
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
          <div className='card__contents'>
            <figure className='card__media'>
              <a href={this.props.url} className='link-wrapper' title='View project'>
                <div className='card__thumbnail'>
                  {this.props.imageNode}
                </div>
              </a>
            </figure>
            <header className='card__header'>
              <div className='card__headline'>
                <a href={this.props.url} className='link-wrapper' title='View project'>
                  <h1 className='card__title'>{this.props.title}</h1>
                </a>
              </div>
            </header>
            <div className='card__body'>
              {this.props.children}
              <a title={this.props.linkTitle} href={this.props.url}>Learn More</a>
            </div>
          </div>
        </article>
      </li>
    );
  }
});

module.exports = CommunityCard;
