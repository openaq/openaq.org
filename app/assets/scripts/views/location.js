'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchLocationIfNeeded } from '../actions/action-creators';
import HeaderMessage from '../components/header-message';

var Location = React.createClass({
  displayName: 'Location',

  propTypes: {
    params: React.PropTypes.object,
    _fetchLocationIfNeeded: React.PropTypes.func,

    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array,

    locFetching: React.PropTypes.bool,
    locFetched: React.PropTypes.bool,
    locError: React.PropTypes.string,
    locData: React.PropTypes.object
  },

  shouldFetchData: function (prevProps) {
    let prevLoc = prevProps.params.name;
    let currLoc = this.props.params.name;

    return prevLoc !== currLoc;
  },

  //
  // Start life-cycle methods.
  //

  componentDidMount: function () {
    this.props._fetchLocationIfNeeded(this.props.params.name);
  },

  componentDidUpdate: function (prevProps) {
    this.shouldFetchData(prevProps) && this.props._fetchLocationIfNeeded(this.props.params.name);
  },

  //
  // Start render methods.
  //

  render: function () {
    let {locFetched: fetched, locFetching: fetching, locError: error, locData: data} = this.props;
    if (!fetched && !fetching) {
      return null;
    }

    if (fetching) {
      return (
        <HeaderMessage>
          <h2>Take a deep breath.</h2>
          <p>Location data is loading...</p>
        </HeaderMessage>
      );
    }

    if (error) {
      return (
        <HeaderMessage>
          <h2>Uhoh, something went wrong</h2>
          <p>There was a problem getting the data. If the problem persists let us know.</p>
          <a href='mailto:info@openaq.org' title='Send us an email'>Send us an Email</a>
        </HeaderMessage>
      );
    }

    let country = _.find(this.props.countries, {code: data.country});

    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>{data.location} <small>in {data.city}, {country.name}</small></h1>
              <div className='inpage__introduction'>
                <p>Good things come to those who wait...</p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold' id='location-source'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Source information</h1>
              </header>
              <div className='fold__body'>
                <div className='col-main'>
                  <p>Source <a href='' title='View source information'>ABC</a></p>
                </div>
                <div className='col-sec'>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores voluptatem nesciunt laboriosam!</p>
                </div>
              </div>
            </div>
          </section>

          <section className='fold fold--filled' id='location-stats'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Stats information</h1>
              </header>
              <div className='fold__body'>
                <div className='col-main'>
                  <dl>
                    <dt>Measurements</dt>
                    <dd>30,665</dd>
                    <dt>Collection Dates</dt>
                    <dd>2015/05/14 - 2016/06/15</dd>
                    <dt>Coordinates</dt>
                    <dd>43.02294, 23.01765</dd>
                  </dl>
                </div>
                <div className='col-sec'>
                  <p>Latest Measurements:</p>
                  <ul>
                    <li><strong>CO</strong> 32ug/m3 at 2016/06/17 4:05pm</li>
                    <li><strong>SO2</strong> 32ug/m3 at 2016/06/17 4:05pm</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,

    locFetching: state.location.fetching,
    locFetched: state.location.fetched,
    locError: state.location.error,
    locData: state.location.data
  };
}

function dispatcher (dispatch) {
  return {
    _fetchLocationIfNeeded: (...args) => dispatch(fetchLocationIfNeeded(...args))
  };
}

module.exports = connect(selector, dispatcher)(Location);
