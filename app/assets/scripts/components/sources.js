var React = require('react');
var Reflux = require('reflux');

var CountryListItem = require('./countryListItem');
var siteStore = require('../stores/sites');
var actions = require('../actions/actions');
var Header = require('./header');

var Sites = React.createClass({

  mixins: [
    Reflux.listenTo(actions.latestSitesLoaded, 'onLatestSitesLoaded')
  ],

  getInitialState: function () {
    return {
      countries: siteStore.storage.countries
    };
  },

  onLatestSitesLoaded: function () {
    this.setState({
      countries: siteStore.storage.countries
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
          <p>Do mollit non et enim aute eiusmod id in aute est ullamco proident do dolor ea est anim esse non dolore irure enim cupidatat qui occaecat occaecat amet voluptate reprehenderit sed do consequat adipisicing deserunt magna enim quis amet non dolore sint ut fugiat reprehenderit proident magna anim quis ex aliquip ad dolor deserunt sit ut adipisicing id culpa Excepteur dolore sed occaecat minim enim est commodo enim sed officia tempor Excepteur dolor reprehenderit non tempor enim laborum quis.</p>
          </div>
          <div className='detail'>
            {this.state.countries.map(function (c) {
              return <CountryListItem country={c} key={c.country} />
            })}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Sites;
