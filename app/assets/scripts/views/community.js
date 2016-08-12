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

          <section className='fold fold--double'>
            <div className='inner'>
              <div className='fold--media about-img1'>
                <div>
                  <img className='fold--img' src='assets/graphics/content/about1.png'/>
                </div>
              </div>
              <div className='fold--content'>
                  <header className='fold__header'>
                    <h1 className='fold__title'>Talk with Us</h1>
                  </header>
                  <div className='fold__body'>
                    <p>Brainstorm and work together with us on new ideas from media articles to research uses to phone apps around air pollution data. Reach out to us on slack , twitter or by email. We’re happy to answer questions and work with you.</p>
                  </div>
                  <div className='contact contact--social'>                    <ul>
                      <li><a href='' className='contact-button-gh' title='View Github'><span>Github</span></a></li>
                      <li><a href='' className='contact-button-slack' title='View Slack'><span>Slack</span></a></li>
                      <li><a href='' className='contact-button-twitter' title='View Twitter'><span>Twitter</span></a></li>
                      <li><a href='' className='contact-button-mail' title='View Email'><span>Email</span></a></li>
                    </ul>
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
                    <p>We aggregate our data from public real-time data sources provided by official, usually government-level, organizations. They do the hard work of measuring these data and publicly sharing them, and we do the work of making them more universally accessible to both humans and machines.</p>
                  </div>
                  <button className='button button--large button--primary-bounded'>View Open Issues</button>
                  <button className='button button--large button--primary-bounded'>See Project Repos</button>
            </div>
          </section>


          <section className='fold fold--double'>
            <div className='inner'>
              <div className='fold--content'>
                  <header className='fold__header'>
                    <h1 className='fold__title'>Attend an Event</h1>
                  </header>
                  <div className='fold__body'>
                    <p>We aggregate our data from public real-time data sources provided by official, usually government-level, organizations. They do the hard work of measuring these data and publicly sharing them, and we do the work of making them more universally accessible to both humans and machines.</p>
                  </div>
                     <button className='button button--large button--primary-bounded'>View Details</button>
              </div>
              <div className='fold--media about-img2'>
                <div>
                  <img className='fold--img'src='assets/graphics/content/about2.png'/>
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
