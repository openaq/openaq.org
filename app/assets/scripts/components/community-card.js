'use strict';
import React from 'react';

var CommunityCard = React.createClass({
  displayName: 'CommunityCard',

  propTypes: {
    title: React.PropTypes.string,
    linkTitle: React.PropTypes.string,
    url: React.PropTypes.string,
    imageNode: React.PropTypes.node,
    children: React.PropTypes.object
  },

  render: function () {
    return (
      <article className='card card--horizontal card--horizontal--align-middle'>
        <div className='card__contents'>
          <figure className='card__media'>
            <div className='card__thumbnail'>
              {this.props.imageNode}
            </div>
          </figure>
          <div className="card__copy">
            <header className='card__header'>
              <h1 className='card__title'><a title={this.props.linkTitle} href={this.props.url}>{this.props.title}</a></h1>
            </header>
            <div className='card__body'>
              {this.props.children}
              <a title={this.props.linkTitle} href={this.props.url}>Learn More</a>
            </div>
          </div>
        </div>
      </article>
    );
  }
});

module.exports = CommunityCard;
