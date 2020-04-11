'use strict';
import React from 'react';
import { connect } from 'react-redux';

import { fetchLandscape } from '../actions/action-creators';
import InfoMessage from '../components/info-message';
import LoadingMessage from '../components/loading-message';

// The attributes shown in the table and that can be filtered on. The key
// corresponds to the column names in the spreadsheet.
const attributes = [
  { key: 'physicalData', label: 'Physical Data' },
  { key: 'highresSpatial', label: 'Spatial Resolution' },
  { key: 'highresTemporal', label: 'Temporal Resolution' },
  { key: 'programmaticAccess', label: 'Programmatic Access' }
];

// Values for the filters.
class Landscape extends React.Component {
  constructor (props) {
    super(props);

    this.clearFilters = this.clearFilters.bind(this);

    this.state = {
      activeFilters: [ ]
    };
  }

  //
  // Start life-cycle methods
  //

  componentDidMount () {
    this.props._fetchLandscape();
  }

  //
  // Event Listeners
  //

  onFilterSelect (what, value) {
    const newFilters = value
      ? [ ...this.state.activeFilters, what ] // add selected filter
      : this.state.activeFilters.filter(f => f !== what); // remove selected filter

    this.setState({ activeFilters: newFilters });
  }

  clearFilters () {
    this.setState({ activeFilters: [] });
  }

  //
  // Start render methods
  //

  renderFilter () {
    return (
      <div className='filters filters--landscape'>
        <h2 className='filters__title'>Show only <button type='button' className='button button--small button--primary-unbounded' title='Clear all selected filters' onClick={this.clearFilters}><small>(Clear Filters)</small></button></h2>
        {attributes.map(f => {
          let checked = this.state.activeFilters.includes(f.key);
          let onChange = this.onFilterSelect.bind(this, f.key, !checked);

          return (
            <label className='form__option form__option--custom-checkbox' htmlFor={f.key} key={f.key}>
              <input type='checkbox' value={f.key} id={f.key} name='form-checkbox' onChange={onChange} checked={checked} />
              <span className='form__option__text'>{f.label}</span>
              <span className='form__option__ui'></span>
            </label>
          );
        })}
      </div>
    );
  }

  renderNoData (cNoData) {
    return (
      <p>{cNoData.map(c => c.country).join(', ')}</p>
    );
  }

  renderCheckMark (answer) {
    return (
      <strong className={answer}>
        <span>{answer}</span>
      </strong>
    );
  }

  renderTable (cWithData) {
    return (
      <table className='landscape-table'>
        <thead>
          <tr>
            <th className='name'>Country</th>
            {attributes.map(attr => (
              <th className='indicator' key={`header-${attr.key}`}>{attr.label}</th>
            ))}
            <th className='view-more' title='View More'>View more</th>
          </tr>
        </thead>
        <tbody>
          {cWithData.map((o, i) => (
            <tr key={i}>
              <td className='name'>{o.country}</td>
              {attributes.map(attr => (
                <td className='indicator' key={`value-${i}-${attr.key}`}>{this.renderCheckMark(o[attr.key])}</td>
              ))}
              <td className='view-more'><span>View more</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  renderContent () {
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

    const { activeFilters } = this.state;

    const cWithData = this.props.landscape
      .filter(c => c.aqData !== 'no')
      .filter(c => {
        // No filters set, return it all.
        if (!activeFilters.length) return true;

        // If any of the property filters is set, exclude the props with answer 'no'
        let excluded = false;
        activeFilters.forEach(f => { if (c[f] === 'no') excluded = true; });

        if (excluded) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score);

    const cNoData = this.props.landscape.filter(c => c.aqData === 'no');

    return (
      <div className='inpage__body'>
        <section className='fold'>
          <div className='inner'>
            {this.renderFilter()}

            <p className='results-summary'>A total of <strong>{cWithData.length}</strong> countries were found</p>

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
  }

  render () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>AQ Data Landscape</h1>
              <div className='inpage__introduction'>
                <p>The landscape provides insight into how governments are producing and sharing air quality data around the world.</p>
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
}

Landscape.propTypes = {
  landscape: React.PropTypes.array,
  _fetchLandscape: React.PropTypes.func,

  lsFetching: React.PropTypes.bool,
  lsFetched: React.PropTypes.bool,
  lsError: React.PropTypes.string
};

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
