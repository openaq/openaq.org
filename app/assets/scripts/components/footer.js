var React = require('react');
var ReactIntl = require('react-intl');
var Reflux = require('reflux');

var siteStore = require('../stores/sites');
var actions = require('../actions/actions');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var Footer = React.createClass({

  mixins: [
    IntlMixin,
    Reflux.listenTo(actions.latestSitesLoaded, 'onLatestSitesLoaded')
  ],

  getInitialState: function () {
    return {
      numMeasurements: 0
    };
  },

  onLatestSitesLoaded: function () {
    this.setState({
      numMeasurements: siteStore.storage.totalNumber
    });
  },

  render () {
    return (
      <footer id='site-footer'>
        <div className='inner'>
          <p>
            <FormattedMessage
              message={this.getIntlMessage('footer')}
              number={this.state.numMeasurements}
              heart={<span className='heart'>♥</span>}
              link={<a href='http://developmentseed.com/' title='Visit Development Seed website'>Development Seed</a>} />
          </p>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
