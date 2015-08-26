var React = require('react');
var _ = require('lodash');

var CityListItem = require('./cityListItem');

var CountryListItem = React.createClass({

  propTypes: {
    country: React.PropTypes.object
  },

  render () {
    return (
      <div className='detail-country-item'>
        {_.map(this.props.country.cities, function (c) {
          return <CityListItem city={c} countryName={this.props.country.country} key={c.city} />;
        }, this)}
      </div>
    );
  }
});

module.exports = CountryListItem;
