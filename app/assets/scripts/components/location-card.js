'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import createReactClass from 'create-react-class';

import { formatThousands } from '../utils/format';

/*
 * create-react-class provides a drop-in replacement for the outdated React.createClass,
 * see https://reactjs.org/docs/react-without-es6.html
 * Please modernize this code using functional components and hooks!
 */
var LocationCard = createReactClass({
  displayName: 'LocationCard',

  propTypes: {
    onDownloadClick: T.func,
    compact: T.bool,
    name: T.string,
    city: T.string,
    countryData: T.object,
    sourcesData: T.array,
    sourceType: T.string,
    totalMeasurements: T.number,
    parametersList: T.array,
    lastUpdate: T.string,
    collectionStart: T.string,
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
        sources.push(
          <a
            href={o.sourceURL}
            title={`View source for  ${this.props.name}`}
            key={o.name}
          >
            {o.name}
          </a>
        );
        if (i < sourcesData.length - 1) {
          sources.push(', ');
        }
      });
    }

    const country = countryData || {};

    return (
      <article className="card card--data">
        <div className="card__contents">
          <header className="card__header">
            <div className="card__headline">
              <p className="card__subtitle">
                Updated <strong>{updated}</strong>
              </p>
              <h1 className="card__title">
                <Link
                  to={`/location/${encodeURIComponent(this.props.name)}`}
                  title={`View ${this.props.name} page`}
                >
                  {this.props.name}
                </Link>{' '}
                <small>
                  in {this.props.city}, {country.name}
                </small>
              </h1>
            </div>
            <div className="card__tags">
              {this.props.sourceType && (
                <div className="filter-pill">{`${this.props.sourceType[0].toUpperCase()}${this.props.sourceType.slice(
                  1
                )}`}</div>
              )}
            </div>
          </header>
          <div className="card__body">
            <dl className="card__meta-details">
              <dt>Collection start</dt>
              <dd>{started}</dd>
              <dt>Measurements</dt>
              <dd>{formatThousands(this.props.totalMeasurements)}</dd>
              <dt>Values</dt>
              <dd>{this.renderParameters()}</dd>
              {sources.length ? <dt>Source</dt> : null}
              {sources.length ? <dd>{sources}</dd> : null}
            </dl>
          </div>
          <footer className="card__footer">
            <ul className="card__footer-actions">
              <li>
                <a
                  href="#"
                  className="cfa-download"
                  title={`Download data for ${this.props.name}`}
                  onClick={this.onDownloadClick}
                >
                  Download
                </a>
              </li>
              <li>
                <Link
                  to={`/location/${encodeURIComponent(this.props.name)}`}
                  className="cfa-go"
                  title={`View ${this.props.name} page`}
                >
                  View More
                </Link>
              </li>
            </ul>
          </footer>
        </div>
      </article>
    );
  },
});

module.exports = LocationCard;
