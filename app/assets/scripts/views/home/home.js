import React, { useEffect, useMemo } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import {
  fetchRandomCompareLocs,
  fetchCompareLocationMeasurements,
  invalidateCompare,
} from '../../actions/action-creators';
import JoinFold from '../../components/join-fold';
import Testimonials from '../../components/testimonials';

import SponsorList from '../../components/sponsor-list';

import sponsors from '../../../content/sponsors.json';
import testimonials from '../../../content/testimonials.json';

import CompareLocationCard from './compare-location-card';
import StatsCount from './stats-count';

import CoverHome from '/assets/graphics/content/view--home/cover--home.jpg';
import OaqIlluHomeStats from '/assets/graphics/layout/oaq-illu-home-stats.svg';
import FoldWhatWeDoMedia from '/assets/graphics/content/view--home/fold-what-we-do-media.png';
import FoldCommunityMedia from '/assets/graphics/content/view--home/fold-community-media.png';

function Home(props) {
  const {
    compareLoc,
    compareMeasurements,
    _invalidateCompare,
    _fetchRandomCompareLocs,
    _fetchCompareLocationMeasurements,
  } = props;

  const randomTestimonials = useMemo(() => {
    // Pick a random testimonial for this mount.
    // This will be removed in the future in favor of a carousel
    const randomTestimonial =
      testimonials[Math.floor(Math.random() * (testimonials.length - 1))];
    return [randomTestimonial];
  }, []);

  const randomSponsors = useMemo(() => {
    const shuffled = [...sponsors].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, []);

  useEffect(() => {
    _invalidateCompare();
    _fetchRandomCompareLocs().then(result => {
      if (!result.error) {
        result.data.forEach((loc, index) => {
          const toDate = moment.utc(loc.lastUpdated);
          const fromDate = toDate.clone().subtract(8, 'days');
          _fetchCompareLocationMeasurements(
            index,
            loc.id,
            fromDate.toISOString(),
            toDate.toISOString(),
            'pm25'
          );
        });
      }
    });
  }, []);

  const [l1, l2] = compareLoc;
  const [m1, m2] = compareMeasurements;

  return (
    <section className="inpage">
      <header className="inpage__header">
        <div className="inner">
          <div className="inpage__headline">
            <h1 className="inpage__title">
              Fighting air inequality through open data and community.
            </h1>
            <div className="inpage__introduction">
              <p>
                OpenAQ is a non-profit organization empowering communities
                around the globe to clean their air by harmonizing, sharing, and
                using open air quality data.
              </p>
            </div>
          </div>
          <div className="home-rand-meas">
            <h2>Here&apos;s how two random locations compare</h2>
            <CompareLocationCard location={l1} measurement={m1} />
            <CompareLocationCard location={l2} measurement={m2} />
          </div>
        </div>
        <figure className="inpage__media inpage__media--cover media">
          <div className="media__item">
            <img src={CoverHome} alt="Cover image" width="1440" height="712" />
          </div>
        </figure>
      </header>
      <div className="inpage__body">
        <section className="fold fold--intro">
          <div className="inner">
            <header className="fold__header">
              <h1 className="fold__title">
                1 out of 8 deaths in the world is due to poor air quality
              </h1>
              <div className="fold__teaser prose prose--responsive">
                <p>
                  This is one of the largest public health threats of our time.
                </p>
              </div>
            </header>
            <figure className="fold__media">
              <img
                src={OaqIlluHomeStats}
                width="408"
                height="80"
                alt="Illustration"
              />
            </figure>
            <p className="fold__action">
              <Link to="/why" title="Learn more" className="go-link">
                <span>Learn more about this problem</span>
              </Link>
            </p>
          </div>
        </section>

        <section className="fold fold--semi-light fold--type-a">
          <div className="inner">
            <header className="fold__header">
              <h1 className="fold__subtitle">What we do</h1>
              <h2 className="fold__title">Harmonizing air quality data</h2>
              <div className="fold__teaser prose prose--responsive">
                <p>
                  The OpenAQ Community harmonizes disparate air quality data
                  from across the world so that citizens and organizations can
                  fight air inequality more efficiently.
                </p>
                <p>
                  <Link to="/about" title="Learn more" className="go-link">
                    <span>Learn more</span>
                  </Link>
                </p>
              </div>
            </header>
            <figure className="fold__media">
              <img
                src={FoldWhatWeDoMedia}
                alt="Fold media"
                width="1246"
                height="1076"
              />
            </figure>
          </div>
        </section>

        <StatsCount />

        <section className="fold fold--type-a" id="home-fold-community">
          <div className="inner">
            <header className="fold__header">
              <h1 className="fold__subtitle">Community</h1>
              <h2 className="fold__title">
                Collective impact through community
              </h2>
              <div className="fold__teaser prose prose--responsive">
                <p>
                  Improving global air quality requires action across sectors
                  and geographies. Our worldwide community leverages open data
                  to build:
                </p>
                <ol className="community-details">
                  <li>Data platforms</li>
                  <li>Developer tools</li>
                  <li>Education tools</li>
                  <li>Low-cost sensors</li>
                  <li>Media</li>
                  <li>Models</li>
                  <li>Research</li>
                  <li>Software</li>
                </ol>
                <p>
                  <Link to="/community" title="Learn more" className="go-link">
                    <span>Learn more</span>
                  </Link>
                </p>
              </div>
            </header>
            <figure className="fold__media">
              <img
                src={FoldCommunityMedia}
                alt="Fold media"
                width="932"
                height="1128"
              />
            </figure>
          </div>
        </section>

        <section
          className="fold fold--semi-light fold--type-b"
          id="home-fold-sponsors"
        >
          <div className="inner">
            <header className="fold__header">
              <h1 className="fold__subtitle">Partners and sponsors</h1>
              <h2 className="fold__title">Enabling change at scale</h2>
              <div className="fold__teaser prose prose--responsive">
                <p>
                  Our nonprofit work is made possible with the support of our
                  partners.
                </p>
              </div>
            </header>
            <figure className="fold__media">
              <SponsorList items={randomSponsors} />
            </figure>
          </div>
        </section>

        <Testimonials items={randomTestimonials} />

        <JoinFold />
      </div>
    </section>
  );
}

Home.propTypes = {
  _fetchRandomCompareLocs: T.func,
  _fetchCompareLocationMeasurements: T.func,
  _invalidateCompare: T.func,

  compareLoc: T.array,
  compareMeasurements: T.array,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    compareLoc: state.compare.locations,
    compareMeasurements: state.compare.measurements,
  };
}

function dispatcher(dispatch) {
  return {
    _invalidateCompare: (...args) => dispatch(invalidateCompare(...args)),

    _fetchRandomCompareLocs: (...args) =>
      dispatch(fetchRandomCompareLocs(...args)),
    _fetchCompareLocationMeasurements: (...args) =>
      dispatch(fetchCompareLocationMeasurements(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Home);
