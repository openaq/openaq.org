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
                <li><a href='' className='contact-button-gh' title='View Github'><span>Github</span></a></li>
                <li><a href='' className='contact-button-slack' title='View Slack'><span>Slack</span></a></li>
                <li><a href='' className='contact-button-twitter' title='View Twitter'><span>Twitter</span></a></li>
                <li><a href='' className='contact-button-mail' title='View Email'><span>Email</span></a></li>
              </ul>
            </div>
            <div className='contact contact--newsletter'>
              <h2 className='contact__title'>Subscribe to our newsletter</h2>
              <div className='form__input-group'>
                <input type='text' placeholder='bruce@wayne.com' className='form__control form__control--medium' />
                <span className='form__input-group-button'><button className='button--subscribe' type='submit'><span>Subscribe</span></button></span>
              </div>
            </div>
          </div>
          <p className='copyright'>
            {copyright} with love by <a href='https://developmentseed.org' title='Visit Development Seed website'>Development Seed</a> and the <a href='https://openaq.org/' title='Visit the OpenAQ website'>OpenAQ</a> team.</p>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
