'use strict';
import React from 'react';
import c from 'classnames';
import moment from 'moment';
import { Link } from 'react-router';

import { formatThousands } from '../utils/format';

var LocationCard = React.createClass({
  displayName: 'LocationCard',

  propTypes: {
    onDownloadClick: React.PropTypes.func,
    compact: React.PropTypes.bool,
    name: React.PropTypes.string,
    city: React.PropTypes.string,
    countryData: React.PropTypes.object,
    sourcesData: React.PropTypes.array,
    totalMeasurements: React.PropTypes.number,
    parametersList: React.PropTypes.array,
    lastUpdate: React.PropTypes.string,
    collectionStart: React.PropTypes.string
  },

  onDownloadClick: function (e) {
    e.preventDefault();
    this.props.onDownloadClick();
  },

  renderParameters: function () {
    return this.props.parametersList.map(o => o.name).join(', ');
  },

  render: function () {
    const { countryData } = this.props;
    let updated = moment(this.props.lastUpdate).fromNow();
    let started = moment(this.props.collectionStart).format('YYYY/MM/DD');
    let sourcesData = this.props.sourcesData;

    let sources = [];
    if (sourcesData.length) {
      sourcesData.forEach((o, i) => {
        sources.push(<a href={o.sourceURL} title={`View source for  ${this.props.name}`} key={o.name}>{o.name}</a>);
        if (i < sourcesData.length - 1) {
          sources.push(', ');
        }
      });
    }

    const country = countryData || {};

    return (
      <article className={c('card', {'card--data-compact': this.props.compact})}>
        <div className='card__contents'>
          <header className='card__header'>
            <div className='card__headline'>
              <p className='card__subtitle'>Updated <strong>{updated}</strong></p>
              <h1 className='card__title'><Link to={`/location/${encodeURIComponent(this.props.name)}`} title={`View ${this.props.name} page`}>{this.props.name}</Link> <small>in {this.props.city}, {country.name}</small></h1>
            </div>
          </header>
          <div className='card__body'>
            <ul className='card__meta-details'>
              <li>Collection Start: {started}</li>
              <li>Measurements: {formatThousands(this.props.totalMeasurements)}</li>
              <li>Values: {this.renderParameters()}</li>
              {sources.length ? <li>Source: {sources}</li> : null}
            </ul>
          </div>
          <footer className='card__footer'>
            <ul className='card__actions'>
              <li><a href='#' className='button-card-download' title={`Download data for ${this.props.name}`} onClick={this.onDownloadClick}>Download</a></li>
              <li><Link to={`/location/${encodeURIComponent(this.props.name)}`} className='button-card-view' title={`View ${this.props.name} page`}>View More</Link></li>
            </ul>
          </footer>
        </div>
      </article>
    );
  }
});

module.exports = LocationCard;
