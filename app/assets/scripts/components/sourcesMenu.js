var React = require('react');
var ReactIntl = require('react-intl');
var _ = require('lodash');
var classNames = require('classnames');

var IntlMixin = ReactIntl.IntlMixin;

var Menu = React.createClass({

  mixins: [IntlMixin],

  propTypes: {
    countries: React.PropTypes.array.isRequired,
    selectedCountry: React.PropTypes.string.isRequired,
    handleSelection: React.PropTypes.func.isRequired
  },

  handleClick: function (e) {
    var country = e.target.getAttribute('data-country');
    this.props.handleSelection(country);
  },

  render: function () {
    return (
      <div className='sources-menu'>
        <div className='divider'></div>
        <ul>
          {_.map(this.props.countries, function (c) {
            return <li className={classNames({'selected': c.country === this.props.selectedCountry})} onClick={this.handleClick} data-country={c.country} key={c.country}>{c.prettyCountry}</li>;
          }, this)}
        </ul>
        <div className='divider'></div>
      </div>
    );
  }
});

module.exports = Menu;
