var React = require('react');
var Reflux = require('reflux');
var ReactIntl = require('react-intl');

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

  render () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='dark' />
        <div className='sites page'>
          <div className='intro'>
            <p>Lorem ipsum Dolor voluptate Excepteur adipisicing minim dolor adipisicing incididunt incididunt tempor et mollit aliquip Duis nostrud officia dolor occaecat culpa sed magna reprehenderit eiusmod laborum veniam sint fugiat ullamco sed sint dolore adipisicing aute magna fugiat aute magna sed incididunt dolor ut adipisicing tempor ex in aliqua proident eu ea sed et deserunt consequat aliqua mollit eiusmod mollit voluptate nulla est exercitation Excepteur exercitation consectetur sed nostrud ea velit adipisicing irure fugiat deserunt reprehenderit laborum sunt laborum ullamco reprehenderit ad minim pariatur cupidatat quis minim officia qui ut reprehenderit cillum labore esse ex nisi Excepteur cupidatat culpa id commodo dolor consequat elit eiusmod fugiat nisi dolore eiusmod exercitation.</p>
            <p>&nbsp;</p>
          </div>
          <p className='cta-wrapper'><a href='#' title='Suggest a new source' className='bttn-cta dark large'><FormattedMessage message={this.getIntlMessage('sources.addData')} /></a></p>
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
