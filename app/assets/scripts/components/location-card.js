'use strict';
import React from 'react';
import c from 'classnames';
import moment from 'moment';
import { Link } from 'react-router';

import { formatThousands } from '../utils/format';

var LocationCard = React.createClass({
  displayName: 'LocationCard',

  propTypes: {
    compact: React.PropTypes.bool,
    name: React.PropTypes.string,
    city: React.PropTypes.string,
    countryData: React.PropTypes.object,
    sourceData: React.PropTypes.object,
    totalMeasurements: React.PropTypes.number,
    parametersList: React.PropTypes.array,
    lastUpdate: React.PropTypes.string,
    collectionStart: React.PropTypes.string
  },

  renderParameters: function () {
    return this.props.parametersList.map(o => o.name).join(', ');
  },

  render: function () {
    let updated = moment(this.props.lastUpdate).fromNow();
    let started = moment(this.props.collectionStart).format('YYYY/MM/DD');

    return (
      <article className={c('card', {'card--data-compact': this.props.compact})}>
        <div className='card__contents'>
          <header className='card__header'>
            <p className='card__subtitle'>Updated <strong>{updated}</strong></p>
            <h1 className='card__title'><Link to={`/location/${this.props.name}`} title={`View ${this.props.name} page`}>{this.props.name}</Link> <small>in {this.props.city}, {this.props.countryData.name}</small></h1>
          </header>
          <div className='card__body'>
            <ul className='card__meta-details'>
              <li>Collection Start: {started}</li>
              <li>Measurements: {formatThousands(this.props.totalMeasurements)}</li>
              <li>Values: {this.renderParameters()}</li>
              <li>Source: <a href={this.props.sourceData.url} title={`View source for  ${this.props.name}`}>{this.props.sourceData.name}</a></li>
            </ul>
          </div>
          <footer className='card__footer'>
            <ul className='card__actions'>
              <li><a href='#' className='button-card-download' title={`Download data for ${this.props.name}`}>Download</a></li>
              <li><Link to={`/location/${this.props.name}`} className='button-card-view' title={`View ${this.props.name} page`}>View More</Link></li>
            </ul>
          </footer>
        </div>
      </article>
    );
  }
});

module.exports = LocationCard;
