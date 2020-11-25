'use strict';
import React from 'react';

var ConnectFold = React.createClass({
  displayName: 'ConnectFold',

  render: function () {
    return (
      <section className='connect-fold'>
        <div className='inner'>
          <header className='connect-fold__header'>
            <h1 className='connect-fold__title'>Connect with the community</h1>
            <div className='prose prose--responsive'>
              <p>Brainstorm and work together with our community on ways to use open air quality data to fight air inequality.</p>
            </div>
          </header>

          <ul className='connect-list'>
            <li>
              <article className='card card--connect card--connect-github'>
                <div className='card__contents'>
                  <header className='card__header'>
                    <div className='card__headline'>
                      <a href='https://github.com/openaq/' target='_blank' title='Follow us' className='link-wrapper'>
                        <h1 className='card__title'>GitHub</h1>
                      </a>
                    </div>
                  </header>
                  <div className='card__body'>
                    <div className='card__prose'>
                      <p>Find out more about our repositories.</p>
                    </div>
                  </div>
                  <footer className='card__footer'>
                    <a href='https://github.com/openaq/' target='_blank' className='card__go-link' title='Follow us'><span>Follow us</span></a>
                  </footer>
                </div>
              </article>
            </li>

            <li>
              <article className='card card--connect card--connect-slack'>
                <div className='card__contents'>
                  <header className='card__header'>
                    <div className='card__headline'>
                      <a href='https://join.slack.com/t/openaq/shared_invite/zt-gq14aew7-CVdp131g7TR7o9iiXIVDLw' target='_blank' title='Join us' className='link-wrapper'>
                        <h1 className='card__title'>Slack</h1>
                      </a>
                    </div>
                  </header>
                  <div className='card__body'>
                    <div className='card__prose'>
                      <p>Join a group where you can ask your questions.</p>
                    </div>
                  </div>
                  <footer className='card__footer'>
                    <a href='https://join.slack.com/t/openaq/shared_invite/zt-gq14aew7-CVdp131g7TR7o9iiXIVDLw' target='_blank' className='card__go-link' title='Follow us'><span>Join us</span></a>
                  </footer>
                </div>
              </article>
            </li>

            <li>
              <article className='card card--connect card--connect-twitter'>
                <div className='card__contents'>
                  <header className='card__header'>
                    <div className='card__headline'>
                      <a href='https://twitter.com/openaq' target='_blank' title='Follow us' className='link-wrapper'>
                        <h1 className='card__title'>Twitter</h1>
                      </a>
                    </div>
                  </header>
                  <div className='card__body'>
                    <div className='card__prose'>
                      <p>Follow us on twitter and get the latest updates.</p>
                    </div>
                  </div>
                  <footer className='card__footer'>
                    <a href='https://twitter.com/openaq' target='_blank' className='card__go-link' title='Follow us'><span>Follow us</span></a>
                  </footer>
                </div>
              </article>
            </li>

            <li>
              <article className='card card--connect card--connect-email'>
                <div className='card__contents'>
                  <header className='card__header'>
                    <div className='card__headline'>
                      <a href='#' title='Get in touch' className='link-wrapper'>
                        <h1 className='card__title'>E-mail</h1>
                      </a>
                    </div>
                  </header>
                  <div className='card__body'>
                    <div className='card__prose'>
                      <p>Send us a mail if you need.</p>
                    </div>
                  </div>
                  <footer className='card__footer'>
                    <a href='mailto:info@openaq.org' className='card__go-link' title='Follow us'><span>Get in touch</span></a>
                  </footer>
                </div>
              </article>
            </li>
          </ul>
        </div>
      </section>
    );
  }
});

module.exports = ConnectFold;
