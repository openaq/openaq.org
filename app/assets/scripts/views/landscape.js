'use strict';
import React from 'react';
import { connect } from 'react-redux';

import { fetchLandscape } from '../actions/action-creators';
import InfoMessage from '../components/info-message';
import LoadingMessage from '../components/loading-message';

var Landscape = React.createClass({
  displayName: 'Landscape',

  propTypes: {
    landscape: React.PropTypes.array,
    _fetchLandscape: React.PropTypes.func,

    lsFetching: React.PropTypes.bool,
    lsFetched: React.PropTypes.bool,
    lsError: React.PropTypes.string
  },

  //
  // Start life-cycle methods
  //

  componentDidMount: function () {
    this.props._fetchLandscape();
  },

  //
  // Start render methods
  //

  renderNoData: function (cNoData) {
    return (
      <p>{cNoData.map(c => c.country).join(', ')}</p>
    );
  },

  renderCheckMark (answer) {
    return (
      <strong className={answer}>
        <span>{answer}</span>
      </strong>
    );
  },

  renderTable: function (cWithData) {
    return (
      <table className='landscape-table'>
        <thead>
          <tr>
            <th className='name'>Country</th>
            <th className='indicator physical'>Physical Data</th>
            <th className='indicator spatial'>High spatial resolution</th>
            <th className='indicator temporal'>High temporal resolution</th>
            <th className='indicator programmatic'>Programmatic Access</th>
            <th className='view-more' title='View More'>View more</th>
          </tr>
        </thead>
        <tbody>
          {cWithData.map((o, i) => (
            <tr key={i}>
              <td className='name'>{o.country}</td>
              <td className='indicator physical'>{this.renderCheckMark(o.physicalData)}</td>
              <td className='indicator spatial'>{this.renderCheckMark(o.highresSpatial)}</td>
              <td className='indicator temporal'>{this.renderCheckMark(o.highresTemporal)}</td>
              <td className='indicator programmatic'>{this.renderCheckMark(o.programmaticAccess)}</td>
              <td className='view-more'><span>View more</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },

  renderContent: function () {
    if (!this.props.lsFetched && !this.props.lsFetching) {
      return null;
    }

    if (this.props.lsFetching) {
      return <LoadingMessage />;
    }

    if (this.props.lsError) {
      return (
        <InfoMessage>
          <p>We coudn't get the landscape data. Please try again later.</p>
          <p>If you think there's a problem, please <a href='mailto:info@openaq.org' title='Contact openaq'>contact us.</a></p>
        </InfoMessage>
      );
    }

    const cWithData = this.props.landscape
      .filter(c => c.aqData !== 'no')
      .sort((a, b) => b.score - a.score);

    const cNoData = this.props.landscape.filter(c => c.aqData === 'no');

    return (
      <div className='inpage__body'>
        <section className='fold'>
          <div className='inner'>
            {this.renderTable(cWithData)}
          </div>
        </section>
        <section className='fold fold--semi-light' id='landscape-nodata'>
          <div className='inner'>
            <header className='fold__header'>
              <h2 className='fold__title'>Countries without AQ data</h2>
              <div className='fold__teaser prose prose--responsive'>
                <p>The following countries have no known public source for air quality data. CTA, anything wrong, improve</p>
              </div>
            </header>
            <div className='fold__body prose prose--responsive'>
              {this.renderNoData(cNoData)}
            </div>
          </div>
        </section>
      </div>
    );
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>AQ Data Landscape</h1>
              <div className='inpage__introduction'>
                <p>This table explores the current state of governmental air quality production and data-sharing in countries around the world.</p>
              </div>
            </div>
          </div>

          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--home/cover--home.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>

        {this.renderContent()}

      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    lsFetching: state.landscape.fetching,
    lsFetched: state.landscape.fetched,
    lsError: state.landscape.error,
    landscape: state.landscape.data
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLandscape: (...args) => dispatch(fetchLandscape(...args))
  };
}

module.exports = connect(selector, dispatcher)(Landscape);
