var React = require('react');
var ReactIntl = require('react-intl');
var MdastComponent = require('mdast-react-component');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;
var Header = require('./header');

var Home = React.createClass({

  mixins: [IntlMixin],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  render: function () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='light no-logo' />
        <div className='home page'>
          {/* banner */}
          <div className='banner'>
            <div className='inner'>
              <h1 className='site-title'><FormattedMessage message={this.getIntlMessage('home.siteName')} /></h1>
              <p className='site-description'><FormattedMessage message={this.getIntlMessage('home.tagline')} /></p>
              <p className='cta-wrapper'><a href='#/sources' title='See the available sources' className='bttn-cta light large'><FormattedMessage message={this.getIntlMessage('home.cta')} /></a></p>
            </div>
          </div>
          {/* banner */}
          {/* content-blocks */}
          <div className='content-blocks'>
            <div className='inner'>
              <section className='feat-block'>
                <h2><FormattedMessage message={this.getIntlMessage('home.what.title')} /></h2>
                <div className='prose'>
                  <MdastComponent>{this.getIntlMessage('home.what.content')}</MdastComponent>
                </div>
              </section>
              <section className='feat-block'>
                <h2><FormattedMessage message={this.getIntlMessage('home.why.title')} /></h2>
                <div className='prose'>
                  <MdastComponent>{this.getIntlMessage('home.why.content')}</MdastComponent>
                </div>
              </section>
              <section className='feat-block'>
                <h2><FormattedMessage message={this.getIntlMessage('home.join.title')} /></h2>
                <div className='prose'>
                  <MdastComponent>{this.getIntlMessage('home.join.content')}</MdastComponent>
                </div>
              </section>
            </div>
          </div>
          {/* content-block */}
        </div>
      </div>
    );
  }
});

module.exports = Home;
