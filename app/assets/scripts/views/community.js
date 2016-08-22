'use strict';
import React from 'react';
import { connect } from 'react-redux';

var About = React.createClass({
  displayName: 'Community',

  propTypes: {
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
                  <h1 className='fold__title'>Talk with Us</h1>
                </header>
                <div className='fold__body'>
                  <p>Brainstorm and work together with us on new ideas from media articles to research uses to phone apps around air pollution data. Reach out to us on slack , twitter or by email. We’re happy to answer questions and work with you.</p>
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
                <h1 className='fold__title'>Contribute Code</h1>
              </header>
              <div className='fold__body'>
                <div className='fold__body--prose'>
                  <p>We aggregate our data from public real-time data sources provided by official, usually government-level, organizations. They do the hard work of measuring these data and publicly sharing them, and we do the work of making them more universally accessible to both humans and machines.</p>
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
                  <h1 className='fold__title'>Attend an Event</h1>
                </header>
                <div className='fold__body'>
                  <p>We aggregate our data from public real-time data sources provided by official, usually government-level, organizations. They do the hard work of measuring these data and publicly sharing them, and we do the work of making them more universally accessible to both humans and machines.</p>
                </div>
                <div className='fold__actions'>
                  <a href='https://medium.com/@openaq/were-going-to-be-doing-more-openaq-workshops-tell-us-where-we-should-go-94d7d2eab234#.y7g82pqn2' target='_blank' className='button button--large button--primary-bounded'>View Details</a>
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
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(About);
