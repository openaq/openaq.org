var React = require('react');

var Header = require('./header');

var About = React.createClass({

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  render: function () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='dark' />
        <div>About Page</div>
      </div>
    );
  }
});

module.exports = About;
