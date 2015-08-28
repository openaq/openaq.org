var React = require('react');
var _ = require('lodash');

var CityListItem = require('./cityListItem');

var CountryListItem = React.createClass({

  propTypes: {
    country: React.PropTypes.object
  },

  render: function () {
    return (
      <div className='detail-country-item' id={this.props.country.country}>
        {_.map(this.props.country.cities, function (c) {
          return <CityListItem city={c} countryName={this.props.country.prettyCountry} key={c.city} />;
        }, this)}
      </div>
    );
  }
});

module.exports = CountryListItem;
