'use strict';
import React from 'react';
import c from 'classnames';

var LocationCard = React.createClass({
  displayName: 'LocationCard',

  propTypes: {
    compact: React.PropTypes.bool
  },

  render: function () {
    // card--data-compact
    return (
      <article className={c('card', {'card--data-compact': this.props.compact})}>
        <div className='card__contents'>
          <header className='card__header'>
            <p className='card__subtitle'>Updated <strong>1 hour ago</strong></p>
            <h1 className='card__title'><a href='#' title='View Wollogong page'>Wollogong</a> in Illawara, Australia</h1>
          </header>
          <div className='card__body'>
            <ul className='card__meta-details'>
              <li>Collection Start: 2015/03/01</li>
              <li>Measurements: 30,665</li>
              <li>Values: PM2.5, PM10, O3</li>
              <li>Source: <a href='#' title='View source for Wollogong'>EPA</a></li>
            </ul>
          </div>
          <footer className='card__footer'>
            <ul className='card__actions'>
              <li><a href='#' className='button-card-download' title='Download data for Wollogong'>Download</a></li>
              <li><a href='#' className='button-card-view' title='View Wollogong page'>View More</a></li>
            </ul>
          </footer>
        </div>
      </article>
    );
  }
});

module.exports = LocationCard;
