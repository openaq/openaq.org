'use strict';
import React from 'react';
import { connect } from 'react-redux';
import c from 'classnames';

import ShareBtn from '../components/share-btn';
import { fetchCompareLocationIfNeeded } from '../actions/action-creators';

var Compare = React.createClass({
  displayName: 'Compare',

  propTypes: {
    params: React.PropTypes.object,
    _fetchCompareLocationIfNeeded: React.PropTypes.func,
    compareLoc: React.PropTypes.array
  },

  componentDidMount: function () {
    let {loc1, loc2, loc3} = this.props.params;
    console.log('loc1, loc2, loc3', loc1, loc2, loc3);
    loc1 && this.props._fetchCompareLocationIfNeeded(0, loc1);
    loc2 && this.props._fetchCompareLocationIfNeeded(1, loc2);
    loc3 && this.props._fetchCompareLocationIfNeeded(2, loc3);
  },

  renderCompareLocations: function () {
    let locs = this.props.compareLoc.filter(o => o.data !== null);

    return (
      <ul className='compare__location-list'>
        {locs.map((o, i) => {
          let d = o.data;
          let kl = ['compare-marker--st', 'compare-marker--nd', 'compare-marker--rd'];
          return (
            <li className='compare__location' key={d.location}>
              <p className='compare__subtitle'>Updates hourly</p>
              <h2 className='compare__title'><span className={c('compare-marker', kl[i])}>{d.location}</span> <small>in {d.city}, country</small></h2>
              <div className='compare__actions'>
                <button type='button' className='button button--small button--primary-unbounded'>Edit</button>
                <button type='button' className='button button--small button--primary-unbounded'>Delete</button>
              </div>
            </li>
          );
        })}
        {locs.length < 3 ? (
          <li className='compare__location-actions' key='action'>
            <button type='button' className='button-compare-location'>Add Location</button>
          </li>
        ) : null}
      </ul>
    );
  },

  render: function () {
    console.log('compareLoc', this.props.compareLoc);
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Compare page</h1>
              <div className='inpage__headline-actions'>
                <ShareBtn />
              </div>
            </div>

            <div className='compare'>
              <ul className='compare__location-list'>
                {this.renderCompareLocations()}
              </ul>
            </div>

          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--filled'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Our data</h1>
              </header>
              <div className='fold__body'>
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
    compareLoc: state.compare.locations
  };
}

function dispatcher (dispatch) {
  return {
    _fetchCompareLocationIfNeeded: (...args) => dispatch(fetchCompareLocationIfNeeded(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Compare);
