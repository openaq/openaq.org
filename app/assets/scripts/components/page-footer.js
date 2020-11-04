'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import { IndexLink, Link } from 'react-router';
import { formatThousands } from '../utils/format';
import createReactClass from 'create-react-class';

var PageFooter = createReactClass({
  displayName: 'PageFooter',

  propTypes: {
    measurements: T.number
  },
  render: function () {
    let copyright = this.props.measurements !== null
      ? `${formatThousands(this.props.measurements)} measurements captured`
      : 'Built';

    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <nav className='page__foot-nav'>
            <div className='foot-nav-block'>
              <h1 className='page__foot-title'>
                <IndexLink to='/' title='Visit homepage'>
                  <img src='/assets/graphics/layout/oaq-logo-col-pos.svg' alt='OpenAQ logotype' width='72' height='40' />
                  <span>OpenAQ</span>
                </IndexLink>
              </h1>
              <h2 className='contact__title'>Connect with us</h2>
              <ul className='connect-menu'>
                <li><a href='https://github.com/openaq/' className='connect-menu__link--github' title='View Github' target='_blank'><span>Github</span></a></li>
                <li><a href='https://openaq-slackin.herokuapp.com/' className='connect-menu__link--slack' title='View Slack' target='_blank'><span>Slack</span></a></li>
                <li><a href='https://twitter.com/openaq' className='connect-menu__link--twitter' title='View Twitter' target='_blank'><span>Twitter</span></a></li>
                <li><a href='mailto:info@openaq.org' className='connect-menu__link--email' title='View Email'><span>Email</span></a></li>
              </ul>
            </div>

            <div className='foot-nav-block'>
              <h2 className='contact__title'>Get involved</h2>
              <ul className='foot-menu'>
                <li><Link to='/community' title='View page'>Participate</Link></li>
                <li><Link to='/community' title='View page'>Support our mission</Link></li>
              </ul>
            </div>

            <div className='foot-nav-block'>
              <h2 className='contact__title'>Open data</h2>
              <ul className='foot-menu'>
                <li><Link to='/locations' title='View page'>Locations</Link></li>
                <li><Link to='/countries' title='View page'>Countries</Link></li>
                <li><Link to='/map' title='View page'>World map</Link></li>
                <li><a href='https://docs.openaq.org/' title='View API' target='_blank'>Use API</a></li>
                <li><a href='https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85' title='View blog post' target='_blank'>License and data disclaimer</a></li>
              </ul>
            </div>

            <div className='foot-nav-block'>
              <h2 className='contact__title'>Community</h2>
              <ul className='foot-menu'>
                <li><Link to='/community' title='View page'>About the community</Link></li>
                <li><Link to='/community/projects?type=Developer+tools' title='View page'>Data tools</Link></li>
                <li><Link to='/community/projects' title='View page'>Community impact</Link></li>
                <li><Link to='/community/workshops' title='View page'>Workshops</Link></li>
              </ul>
            </div>

            <div className='foot-nav-block'>
              <h2 className='contact__title'>About</h2>
              <ul className='foot-menu'>
                <li><Link to='/about' title='View page'>Our organization</Link></li>
                <li><a href='https://medium.com/@openaq' title='View blog' target='_blank'>Blog</a></li>
                <li><Link to='/about' title='View page'>Contact</Link></li>
                <li><a href='https://github.com/openaq/openaq-info/blob/master/FAQ.md' title='View FAQs'>FAQs</a></li>
              </ul>
            </div>
          </nav>

          <div className='foot-info'>
            <div className='foot-newsletter'>
              <h2>Subscribe to our newsletter</h2>
              <form ref='newsletterForm' action='//openaq.us10.list-manage.com/subscribe/post?u=ca93b2911fff40db15f6e7203&amp;id=e65a8618a1' method='post' id='mc-embedded-subscribe-form' name='mc-embedded-subscribe-form' target='_blank' noValidate>
                <div className='form__input-group'>
                  <input type='email' name='EMAIL' id='mce-EMAIL' placeholder='your@email.com' className='form__control form__control--medium' required />
                  <span className='form__input-group-button'><button className='button--subscribe' type='submit' onClick={() => this.refs.newsletterForm.reset()}><span>Subscribe</span></button></span>
                </div>
                {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden='true'>
                  <input type='text' name='b_ca93b2911fff40db15f6e7203_e65a8618a1' tabIndex='-1' value='' />
                </div>
              </form>
            </div>

            <p className='foot-copyright'>{copyright} with love by <a href='https://openaq.org/' title='Visit the OpenAQ website'>OpenAQ</a>.</p>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
