var React = require('react');

var Header = require('./header');

var Methodology = React.createClass({

  propTypes: {
    messages: React.PropTypes.object.isRequired,
    locales: React.PropTypes.array.isRequired
  },

  render () {
    return (
      <div>
        <Header locales={this.props.locales} messages={this.props.messages} style='dark' />
        <div>Methodology Page</div>
      </div>
    );
  }
});

module.exports = Methodology;
