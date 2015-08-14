var React = require('react');
var Link = require('react-router').Link;
var ReactIntl = require('react-intl');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Header = React.createClass({

  mixins: [IntlMixin],

  render () {
    return (
      <header id='site-header' role='banner' className={this.props.style}>
        <div className='site-logo'><a href='#/' title='OpenAQ'><img src='/assets/graphics/layout/wind.png' /></a></div>
        <nav id='site-prime-nav' role='navigation'>
          <ul className='global-menu'>
            <li><a href='https://github.com/openaq/openaq-api'><FormattedMessage message={this.getIntlMessage('header.code')} /></a></li>
            <li><a href='https://docs.openaq.org'><FormattedMessage message={this.getIntlMessage('header.api')} /></a></li>
            <li><Link to='sources'><FormattedMessage message={this.getIntlMessage('header.sources')} /></Link></li>
          </ul>
        </nav>
      </header>
    );
  }
});

module.exports = Header;
