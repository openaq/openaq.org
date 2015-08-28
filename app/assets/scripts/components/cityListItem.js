var React = require('react');

var DetailItem = require('./locationDetailItem');

var CityListItem = React.createClass({

  propTypes: {
    city: React.PropTypes.object,
    countryName: React.PropTypes.string
  },

  render: function () {
    return (
      <div className='detail-city-item'>
        <div className='title'>{this.props.countryName} - {this.props.city.city}</div>
        {this.props.city.locations.map(function (l) {
          return <DetailItem location={l} key={l.location} />;
        })}
      </div>
    );
  }
});

module.exports = CityListItem;
