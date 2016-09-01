'use strict';
import React from 'react';
import { formatThousands } from '../utils/format';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  propTypes: {
    measurements: React.PropTypes.number
  },
  render: function () {
    let copyright = this.props.measurements !== null
      ? `${formatThousands(this.props.measurements)} measurements captured`
      : 'Built';

    return (
      <footer className='page__footer' role='contentinfo'>
        <div className='inner'>
          <div className='contact-info'>
            <div className='contact contact--social'>
              <h2 className='contact__title'>Connect with us</h2>
              <ul>
                <li><a href='https://github.com/openaq/' className='contact-button-gh' title='View Github'><span>Github</span></a></li>
                <li><a href='https://openaq-slackin.herokuapp.com/' className='contact-button-slack' title='View Slack'><span>Slack</span></a></li>
                <li><a href='https://twitter.com/open_aq' className='contact-button-twitter' title='View Twitter'><span>Twitter</span></a></li>
                <li><a href='mailto:info@openaq.org' className='contact-button-mail' title='View Email'><span>Email</span></a></li>
              </ul>
            </div>
            <div className='contact contact--newsletter'>
              <h2 className='contact__title'>Subscribe to our newsletter</h2>
              <form ref='newsletterForm' action='//openaq.us10.list-manage.com/subscribe/post?u=ca93b2911fff40db15f6e7203&amp;id=e65a8618a1' method='post' id='mc-embedded-subscribe-form' name='mc-embedded-subscribe-form' target='_blank' noValidate>
                <div className='form__input-group'>
                  <input type='email' name='EMAIL' id='mce-EMAIL' placeholder='bruce@wayne.com' className='form__control form__control--medium' required/>
                  <span className='form__input-group-button'><button className='button--subscribe' type='submit' onClick={() => this.refs.newsletterForm.reset()}><span>Subscribe</span></button></span>
                </div>
                {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                <div style={{position: 'absolute', left: '-5000px'}} aria-hidden='true'>
                  <input type='text' name='b_ca93b2911fff40db15f6e7203_e65a8618a1' tabIndex='-1' value='' />
                </div>
              </form>
            </div>
          </div>
          <p className='copyright'>
            {copyright} with <span className='openaq-ds-icon openaq-ds-icon-heart-full'></span> by <a href='https://developmentseed.org' title='Visit Development Seed website'>Development Seed</a> and the <a href='https://openaq.org/' title='Visit the OpenAQ website'>OpenAQ</a> team.</p>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
