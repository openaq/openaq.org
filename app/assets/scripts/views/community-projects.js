'use strict';
import React from 'react';
import { connect } from 'react-redux';
import widont from '../utils/widont';
import _ from 'lodash';

import ConnectFold from '../components/connect-fold';
import CommunityCard from '../components/community-card';
import content from '../../content/content.json';

var CommunityProjects = React.createClass({
  displayName: 'Community Impact',

  propTypes: {
  },

  renderProjects: function () {
    let cards = _(content.projects)
      .values()
      .shuffle()
      .map(o => {
        return (
          <CommunityCard
            key={_.kebabCase(o.title)}
            horizontal={true}
            title={o.title}
            linkTitle='View this community contribution'
            url={o.url}
            imageNode={<img width='256' height='256' src={o.image} alt='Project image' />}
            type={o.type}
            location={o.location}
            logo={o.logo}
          >
            <div className='card__prose' dangerouslySetInnerHTML={{__html: o.body}} />
          </CommunityCard>
        );
      })
      .value();

    return (
      <section className='fold' id='community-fold-projects'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Projects</h1>
            <nav className='fold__nav'>
              <h2>Filter by</h2>
              <h3>Type</h3>
              <a href='#' title='Filter by type'><span>All types</span></a>
              <h3>Location</h3>
              <a href='#' title='Filter by location'><span>All locations</span></a>
              <p className='summary'>Showing 34 projects</p>
            </nav>
          </header>
          <ul className='project-list'>
            {cards}
          </ul>
        </div>
      </section>
    );
  },

  render: function () {
    return (
      <section className='inpage'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline header--centered'>
              <h1 className='inpage__title'>Community Impact</h1>
              <div className='inpage__introduction'>
                <p>{widont('Projects of our community using the data to fight air inquality in the most exciting ways..')}</p>
              </div>
            </div>
          </div>
          <figure className='inpage__media inpage__media--cover media'>
            <div className='media__item'>
              <img src='/assets/graphics/content/view--home/cover--home.jpg' alt='Cover image' width='1440' height='712' />
            </div>
          </figure>
        </header>
        <div className='inpage__body'>
          {this.renderProjects()}
          <ConnectFold />
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(CommunityProjects);
