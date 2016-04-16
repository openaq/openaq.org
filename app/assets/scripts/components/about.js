var React = require('react');
var ReactIntl = require('react-intl');
var MdastComponent = require('./mdast-react-component');

var Header = require('./header');
var Footer = require('./footer');

var IntlMixin = ReactIntl.IntlMixin;

var About = React.createClass({

  mixins: [
    IntlMixin
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  render: function () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='dark' />
        <div className='about page'>
          <div className='intro'>
            <MdastComponent>{this.getIntlMessage('about.intro')}</MdastComponent>
          </div>
        </div>
        <Footer locales={this.props.locales} messages={this.props.messages} />
      </div>
    );
  }
});

module.exports = About;
