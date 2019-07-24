'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { shortenLargeNumber } from '../utils/format';
import { geolocateUser,
  fetchNearbyLocations,
  fetchCompareLocationIfNeeded,
  fetchCompareLocationMeasurements,
  invalidateCompare,
  openDownloadModal } from '../actions/action-creators';
import LoadingMessage from '../components/loading-message';

var Home = React.createClass({
  displayName: 'Home',

  propTypes: {
    _geolocateUser: React.PropTypes.func,
    _fetchNearbyLocations: React.PropTypes.func,
    _fetchCompareLocationIfNeeded: React.PropTypes.func,
    _fetchCompareLocationMeasurements: React.PropTypes.func,
    _invalidateCompare: React.PropTypes.func,
    _openDownloadModal: React.PropTypes.func,

    statsCounts: React.PropTypes.object,
    statsCountsFetching: React.PropTypes.bool,
    statsCountsFetched: React.PropTypes.bool,

    geolocationRequesting: React.PropTypes.bool,
    geolocationRequested: React.PropTypes.bool,
    geolocationError: React.PropTypes.string,
    geolocationCoords: React.PropTypes.object,

    locFetching: React.PropTypes.bool,
    locFetched: React.PropTypes.bool,
    locError: React.PropTypes.string,
    locations: React.PropTypes.array,
    locPagination: React.PropTypes.object,

    countries: React.PropTypes.array,
    sources: React.PropTypes.array,
    parameters: React.PropTypes.array,
    totalMeasurements: React.PropTypes.number,

    compareLoc: React.PropTypes.array,
    compareMeasurements: React.PropTypes.array
  },

  //
  // Start life-cycle methods
  //
  componentDidMount: function () {
    this.props._invalidateCompare();
    // We're currently showing 2 random locations in the homepage. However
    // there's no api endpoint to do this. The only way is to query for a random
    // page. For now we're hardcoding the total number of pages available but in
    // the future this should be dynamic.
    // Total pages come from this query.
    // https://api.openaq.org/v1/locations?parameter=pm25&limit=1
    let totalPages = 2780;

    this.props._fetchCompareLocationIfNeeded(0, null, {
      page: Math.floor(Math.random() * totalPages) + 1,
      parameter: 'pm25',
      limit: 1
    });

    this.props._fetchCompareLocationIfNeeded(1, null, {
      page: Math.floor(Math.random() * totalPages) + 1,
      parameter: 'pm25',
      limit: 1
    });
  },

  componentDidUpdate: function () {
    let [l1, l2] = this.props.compareLoc;
    let [m1, m2] = this.props.compareMeasurements;

    let toDate = moment.utc();
    let fromDate = toDate.clone().subtract(8, 'days');

    if (l1.fetched && !m1.fetched && !m1.fetching) {
      // Fetch measurements after we have the location name.
      this.props._fetchCompareLocationMeasurements(0, l1.data.location, fromDate.toISOString(), toDate.toISOString());
    }

    if (l2.fetched && !m2.fetched && !m2.fetching) {
      // Fetch measurements after we have the location name.
      this.props._fetchCompareLocationMeasurements(1, l2.data.location, fromDate.toISOString(), toDate.toISOString());
    }
  },

  //
  // Start render methods
  //

  renderStatsCount: function () {
    let {statsCountsFetching: fetching, statsCountsFetched: fetched, statsCounts: data} = this.props;
    if (!fetched && !fetching) {
      return null;
    }

    return (
      <section className='fold fold--dark fold--type-b' id='home-fold-open-data'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Open Data</h1>
            <div className='fold__teaser prose prose--responsive'>
              <p>The data is captured from multiple sources and available for anyone to access through our open-source platform.</p>
              <ol className='od-quick-menu'>
                <li><Link to='#' title='View page' className='od-quick-menu__locations-link'>Location view</Link></li>
                <li><Link to='#' title='View page' className='od-quick-menu__api-link'>API</Link></li>
                <li><Link to='#' title='View page' className='od-quick-menu__countries-link'>Country view</Link></li>
                <li><Link to='#' title='View page' className='od-quick-menu__compare-link'>Compare data</Link></li>
              </ol>
              <p className='fold__main-action'>
                <Link to='#' className='button button--large button--primary-ghost button--capsule' title='View page'><span>See open data</span></Link>
                <Link to='#' className='button button--large button--white-bounded button--capsule' title='View page'><span>Use API</span></Link>
              </p>
            </div>
          </header>
          <div className='fold__media'>
            {!fetching
              ? (<dl className='od-stats'>
                  <dt>Air quality measurements</dt>
                  <dd><span>{shortenLargeNumber(data.totalMeasurements, 0)}</span></dd>
                  <dt>Data sources</dt>
                  <dd><span>{shortenLargeNumber(data.sources, 0)}</span></dd>
                  <dt>Locations</dt>
                  <dd><span>{shortenLargeNumber(data.locations, 0)}</span></dd>
                  <dt>Countries</dt>
                  <dd><span>{shortenLargeNumber(data.countries, 0)}</span></dd>
                </dl>)
              : <LoadingMessage />}
          </div>
        </div>
      </section>
    );
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className='inpage__title'>Fighting air inequality through open data and community.</h1>
              <div className='inpage__introduction'>
                <p>OpenAQ is a non-profit organization on a mission to empower communities to clean their air by harmonizing, sharing, and using open air quality data from around the globe.</p>
              </div>
            </div>
            <div className='home-rand-meas'>
              <h2>Here's how two random locations compare</h2>
              <article className='meas-card'>
                <div className='inner'>
                  <h1>Station ID1</h1>
                  <dl>
                    <dt>Term</dt>
                    <dd>Value</dd>
                  </dl>
                </div>
              </article>

              <article className='meas-card'>
                <div className='inner'>
                  <h1>Station ID1</h1>
                  <dl>
                    <dt>Term</dt>
                    <dd>Value</dd>
                  </dl>
                </div>
              </article>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

        <section className='block' id='home-block-intro'>
          <div className='inner'>
            <header className='fold__header'>
              <h1 className='block__title'>1 out of 8 deaths in the world is due to poor air quality</h1>
              <div className='block__teaser prose prose--responsive'>
                <p>This is one of the largest public health threats of our time.</p>
                <figure>
                  <img src='/assets/graphics/layout/oaq-illu-home-stats.svg' width='408' height='80' alt='Illustration' />
                </figure>
                <p><Link to='#' title='Learn more' className='go-link'><span>Learn more about this problem</span></Link></p>
              </div>
            </header>
          </div>
        </section>

          <section className='fold fold--semi-light fold--type-a'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__subtitle'>What we do</h1>
                <h2 className='fold__title'>Harmonizing air quality data</h2>
                <div className='fold__teaser prose prose--responsive'>
                  <p>Our community harmonizes disparate air quality data from across the world so that various people and organizations can do more with the data, build open-source tools around them, and engage with one another. All of this is so people don't have to reinvent the same data access-, tool-, and community-wheels and can instead get down to fighting "air inequality" more efficiently.</p>
                  <p><Link to='#' title='Learn more' className='go-link'><span>Learn more</span></Link></p>
                </div>
              </header>
              <div className='fold__media'>
                <figure>
                  <img src='https://via.placeholder.com/960' width='960' height='960' alt='Image placeholder' />
                </figure>
              </div>
            </div>
          </section>

          {this.renderStatsCount()}

          <section className='fold fold--type-a' id='home-community-fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__subtitle'>Community</h1>
                <h2 className='fold__title'>Our community creates collective impact</h2>
                <div className='fold__teaser prose prose--responsive'>
                  <p>Improving global air quality requires diverse activities across many sectors and geographies. Our worldwide community leverages open data, tools, and one another for impact.</p>
                  <ol className='community-details'>
                    <li>Apps</li>
                    <li>Browsers</li>
                    <li>Modeling/Forecasting</li>
                    <li>Products</li>
                    <li>Data Platforms</li>
                    <li>News/Journal Articles</li>
                    <li>Workshops</li>
                    <li>Maps</li>
                  </ol>
                  <p><Link to='#' title='Learn more' className='go-link'><span>Learn more</span></Link></p>
                </div>
              </header>
              <div className='fold__media'>
                <figure>
                  <img src='https://via.placeholder.com/960' width='960' height='960' alt='Image placeholder' />
                </figure>
              </div>
            </div>
          </section>

          <section className='fold fold--semi-light fold--type-b' id='home-partners-fold'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__subtitle'>Partners and sponsors</h1>
                <h2 className='fold__title'>Together making a difference</h2>
                <div className='fold__teaser prose prose--responsive'>
                  <p>Our non-profit work is made possible through the support of a variety of organizations.</p>
                </div>
              </header>
              <div className='fold__media'>
                <ol className='hpf-sponsors-list'>
                  <li>
                    <a href='#' title='Visit partner'>
                      <img src='https://via.placeholder.com/960x480' width='960' height='480' alt='Logo placeholder' />
                      <span>Partner name</span>
                    </a>
                  </li>
                  <li>
                    <a href='#' title='Visit partner'>
                      <img src='https://via.placeholder.com/960x480' width='960' height='480' alt='Logo placeholder' />
                      <span>Partner name</span>
                    </a>
                  </li>
                  <li>
                    <a href='#' title='Visit partner'>
                      <img src='https://via.placeholder.com/960x480' width='960' height='480' alt='Logo placeholder' />
                      <span>Partner name</span>
                    </a>
                  </li>
                  <li>
                    <a href='#' title='Visit partner'>
                      <img src='https://via.placeholder.com/960x480' width='960' height='480' alt='Logo placeholder' />
                      <span>Partner name</span>
                    </a>
                  </li>
                  <li>
                    <a href='#' title='Visit partner'>
                      <img src='https://via.placeholder.com/960x480' width='960' height='480' alt='Logo placeholder' />
                      <span>Partner name</span>
                    </a>
                  </li>
                  <li>
                    <a href='#' title='Visit partner'>
                      <img src='https://via.placeholder.com/960x480' width='960' height='480' alt='Logo placeholder' />
                      <span>Partner name</span>
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          <section className='testimonials'>
            <div className='inner'>
              <h1 className='testimonials__title'>Testimonials</h1>
              <ol className='testimonials-list'>
                <li>
                  <blockquote className='testimonial'>
                    <div className='testimonial__media'>
                      <img src='https://via.placeholder.com/960' width='960' height='960' alt='Image placeholder' />
                    </div>
                    <div className='testimonial__copy'>
                      <div className='testimonial__quote'>
                        <p>OpenAQ is the Wikipedia of Air Quality.</p>
                      </div>
                      <footer className='testimonial__footer'>
                        <strong>Ian Schuler</strong>
                        <small>CEO/Development Seed / Washington, DC USA</small>
                      </footer>
                    </div>
                  </blockquote>
                </li>
              </ol>
            </div>
          </section>

          <section className='join-fold'>
            <div className='inner'>
              <header className='join-fold__header'>
                <h1 className='join-fold__title'>Join a community that believes everyone should have access to clean air.</h1>
              </header>

              <div className='join-fold__cards'>
                <article className='join-card'>
                  <div className='inner'>
                    <div className='join-card__media'>
                      <figure>
                        <img src='/assets/graphics/layout/oaq-icon-illu-40-join-community.svg' width='40' height='40' alt='Illustration' />
                      </figure>
                    </div>
                    <div className='join-card__copy'>
                      <h1 className='join-card__title'>Participate</h1>
                      <p>Be a data source, a consumer or a platform builder.</p>
                      <p className='join-card__main-action'>
                        <Link to='#' className='join-card__go-link' title='View more'><span>Participate</span></Link>
                      </p>
                    </div>
                  </div>
                </article>

                <article className='join-card'>
                  <div className='inner'>
                    <div className='join-card__media'>
                      <figure>
                        <img src='/assets/graphics/layout/oaq-icon-illu-40-support.svg' width='40' height='40' alt='Illustration' />
                      </figure>
                    </div>
                    <div className='join-card__copy'>
                      <h1 className='join-card__title'>Support our mission</h1>
                      <p>Be a financial partner to help fight air inequality.</p>
                      <p className='join-card__main-action'>
                        <Link to='#' className='join-card__go-link' title='View more'><span>Support</span></Link>
                      </p>
                    </div>
                  </div>
                </article>
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
    statsCounts: state.baseStats.data,
    statsCountsFetching: state.baseStats.fetching,
    statsCountsFetched: state.baseStats.fetched,

    geolocationRequesting: state.geolocation.requesting,
    geolocationRequested: state.geolocation.requested,
    geolocationError: state.geolocation.error,
    geolocationCoords: state.geolocation.coords,

    locFetching: state.nearbyLocations.fetching,
    locFetched: state.nearbyLocations.fetched,
    locError: state.nearbyLocations.error,
    locations: state.nearbyLocations.data.results,

    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    parameters: state.baseData.data.parameters,
    totalMeasurements: state.baseData.data.totalMeasurements,

    compareLoc: state.compare.locations,
    compareMeasurements: state.compare.measurements
  };
}

function dispatcher (dispatch) {
  return {
    _geolocateUser: (...args) => dispatch(geolocateUser(...args)),
    _fetchNearbyLocations: (...args) => dispatch(fetchNearbyLocations(...args)),

    _invalidateCompare: (...args) => dispatch(invalidateCompare(...args)),

    _fetchCompareLocationIfNeeded: (...args) => dispatch(fetchCompareLocationIfNeeded(...args)),
    _fetchCompareLocationMeasurements: (...args) => dispatch(fetchCompareLocationMeasurements(...args)),

    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args))
  };
}

module.exports = connect(selector, dispatcher)(Home);
