var React = require('react');
var Reflux = require('reflux');
var ReactIntl = require('react-intl');
var MdastComponent = require('./mdast-react-component');

var IntlMixin = ReactIntl.IntlMixin;
var FormattedMessage = ReactIntl.FormattedMessage;

var CountryListItem = require('./countryListItem');
var metadataStore = require('../stores/metadata');
var actions = require('../actions/actions');
var Header = require('./header');
var Footer = require('./footer');
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
    // Check to see if countries are loaded yet for selectedCountry
    var selectedCountry = '';
    if (metadataStore.storage.countries.length >= 1) {
      selectedCountry = metadataStore.storage.countries[0].country;
    }

    return {
      countries: metadataStore.storage.countries,
      selectedCountry: selectedCountry
    };
  },

  onMetadataLoaded: function () {
    this.setState({
      countries: metadataStore.storage.countries,
      selectedCountry: metadataStore.storage.countries[0].country
    });
  },

  handleMenuSelection: function (country) {
    this.setState({
      selectedCountry: country
    });
  },

  render: function () {
    var selectedCountry = this.state.selectedCountry;
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='dark' />
        <div className='sites page'>
          <div className='intro'>
            <MdastComponent>{this.getIntlMessage('sources.intro')}</MdastComponent>
          </div>
          <p className='cta-wrapper'><a href='https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform' target='_blank' title='Suggest a new source' className='bttn-cta dark large'><FormattedMessage message={this.getIntlMessage('sources.addData')} /></a></p>
          <div className='detail'>
            <Menu
              countries={this.state.countries}
              selectedCountry={selectedCountry}
              handleSelection={this.handleMenuSelection}
            />
            {this.state.countries.map(function (c) {
              if (c.country === selectedCountry) {
                return <CountryListItem country={c} key={c.country} />;
              } else {
                return '';
              }
            })}
          </div>
        </div>
        <Footer locales={this.props.locales} messages={this.props.messages} />
      </div>
    );
  }
});

module.exports = Sites;
