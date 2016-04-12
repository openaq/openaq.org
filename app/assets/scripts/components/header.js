var React = require('react');
var Link = require('react-router').Link;
var ReactIntl = require('react-intl');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Header = React.createClass({

  mixins: [IntlMixin],

  propTypes: {
    style: React.PropTypes.string
  },

  render: function () {
    var logo = (this.props.style.indexOf('light') === -1) ? '/assets/graphics/layout/wind.png' : '/assets/graphics/layout/wind_white.png';
    return (
      <header id='site-header' role='banner' className={this.props.style}>
        <div className='site-logo'><a href='#/' title='OpenAQ'><img src={logo} /></a></div>
        <nav id='site-prime-nav' role='navigation'>
          <ul className='global-menu'>
            <li><Link to='map'><FormattedMessage message={this.getIntlMessage('header.map')} /></Link></li>
            <li><Link to='about'><FormattedMessage message={this.getIntlMessage('header.about')} /></Link></li>
            <li><Link to='sources'><FormattedMessage message={this.getIntlMessage('header.sources')} /></Link></li>
            <li><a href='https://medium.com/@openaq'><FormattedMessage message={this.getIntlMessage('header.news')} /></a></li>
            <li><a href='https://docs.openaq.org'><FormattedMessage message={this.getIntlMessage('header.api')} /></a></li>
            <li><a href='https://github.com/openaq/openaq-api'><FormattedMessage message={this.getIntlMessage('header.code')} /></a></li>
          </ul>
        </nav>
      </header>
    );
  }
});

module.exports = Header;
