var React = require('react');
var Reflux = require('reflux');
var ReactIntl = require('react-intl');
var MdastComponent = require('mdast-react-component');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var CountryListItem = require('./countryListItem');
var metadataStore = require('../stores/metadata');
var actions = require('../actions/actions');
var Header = require('./header');
var Menu = require('./sourcesMenu');

var Sites = React.createClass({

  mixins: [
    IntlMixin,
    Reflux.listenTo(actions.metadataLoaded, 'onMetadataLoaded')
  ],

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  getInitialState: function () {
    return {
      countries: metadataStore.storage.countries
    };
  },

  onMetadataLoaded: function () {
    this.setState({
      countries: metadataStore.storage.countries
    });
  },

  render: function () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='dark' />
        <div className='sites page'>
          <div className='intro'>
            <MdastComponent>{this.getIntlMessage('sources.intro')}</MdastComponent>
          </div>
          <p className='cta-wrapper'><a href='https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform' target='_blank' title='Suggest a new source' className='bttn-cta dark large'><FormattedMessage message={this.getIntlMessage('sources.addData')} /></a></p>
          <div className='detail'>
            <Menu countries={this.state.countries} />
            {this.state.countries.map(function (c) {
              return <CountryListItem country={c} key={c.country} />;
            })}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Sites;
