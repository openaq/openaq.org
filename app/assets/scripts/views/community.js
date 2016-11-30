'use strict';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import CommunityCard from '../components/community-card';
import content from '../../content/content.json';

var About = React.createClass({
  displayName: 'Community',

  propTypes: {
  },

  renderProjects: function () {
    let cards = _(content.projects)
      .values()
      .sortBy('fileName')
      .take(6)
      .map(o => {
        return (
          <CommunityCard
            key={_.kebabCase(o.title)}
            horizontal={true}
            title={o.title}
            linkTitle='View this community contribution'
            url={o.url}
            imageNode={<img width='256' height='256' src={o.image} alt='Project image' />} >
            <div dangerouslySetInnerHTML={{__html: o.body}} />
          </CommunityCard>
        );
      })
      .value();

    return (
      <section className='fold fold--filled' id='community-projects'>
        <div className='inner'>
          <header className='fold__header'>
            <h1 className='fold__title'>Join our community</h1>
          </header>
          <div className='fold__body'>
            <div className='fold__body--prose'>
              <p>Learn how researchers, software developers, educators, and journalists are using open air quality data in exciting ways to fight air inequality.</p>
            </div>
            <div>
              {cards}
            </div>
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
            <div className='inpage__headline header--centered'>
              <h1 className='inpage__title'>Get Involved</h1>
              <div className='inpage__introduction'>
                <p>We are a community of scientists, software developers, and lovers of open environmental data.</p>
              </div>
            </div>
          </div>
        </header>
        <div className='inpage__body'>

          <section className='fold fold--media-bleed-left' id='community-connect'>
            <div className='inner'>
              <div className='fold__media'>
                <figure className='media' style={{backgroundImage: 'url(assets/graphics/content/community1.jpg)'}}>
                  <img className='media__item' src='assets/graphics/content/community1.jpg' width='768' height='768' alt='About image 1' />
                </figure>
              </div>
              <div className='fold__copy'>
                <header className='fold__header'>
                  <h1 className='fold__title'>Connect</h1>
                </header>
                <div className='fold__body'>
                  <p>Brainstorm and work together with our community on ways to use open air quality data to fight air inequality. Reach out on slack, twitter or by email. We’d love to help make your open air quality project a reality.</p>
                  <div className='contact contact--social'>
                    <ul>
                      <li><a href='https://github.com/openaq' className='contact-button-gh' title='View Github'><span>Github</span></a></li>
                      <li><a href='https://openaq-slackin.herokuapp.com/' className='contact-button-slack' title='View Slack'><span>Slack</span></a></li>
                      <li><a href='https://twitter.com/open_aq' className='contact-button-twitter' title='View Twitter'><span>Twitter</span></a></li>
                      <li><a href='mailto:info@openaq.org' className='contact-button-mail' title='View Email'><span>Email</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='fold fold--filled'>
            <div className='inner'>
              <header className='fold__header'>
                <h1 className='fold__title'>Contribute</h1>
              </header>
              <div className='fold__body'>
                <div className='fold__body--prose'>
                  <p>Interested in contributing to this project? Suggest new data sources, fix GH issues, or otherwise help to continue building our infrastructure. Feel free to re-purpose any portion of our open-source project for your own work.</p>
                </div>
              </div>
              <div className='fold__actions'>
                <a href='https://github.com/openaq/openaq-api/issues' target='_blank' className='button button--large button--primary-bounded'>View Open Issues</a>
                <a href='https://github.com/openaq/' target='_blank' className='button button--large button--primary-bounded'>See Project Repos</a>
              </div>
            </div>
          </section>

          <section className='fold fold--media-bleed-right'>
            <div className='inner'>
              <div className='fold__media'>
                <figure className='media' style={{backgroundImage: 'url(assets/graphics/content/community2.jpg)'}}>
                  <img className='media__item' src='assets/graphics/content/community2.jpg' width='768' height='768' alt='About image 2' />
                </figure>
              </div>
              <div className='fold__copy'>
                <header className='fold__header'>
                  <h1 className='fold__title'>Hold a Workshop</h1>
                </header>
                <div className='fold__body'>
                  <p>Interested in convening various members of your community around open air quality data? We can help - either by planning an in-person or virtual visit to your community or sharing resources from previous OpenAQ workshops and meet ups.</p>
                </div>
                <div className='fold__actions'>
                  <a href='https://medium.com/@openaq/were-going-to-be-doing-more-openaq-workshops-tell-us-where-we-should-go-94d7d2eab234#.y7g82pqn2' target='_blank' className='button button--large button--primary-bounded'>View Details</a>
                </div>
              </div>
            </div>
          </section>

          {this.renderProjects()}

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

module.exports = connect(selector, dispatcher)(About);
