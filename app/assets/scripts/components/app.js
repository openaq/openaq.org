var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Footer = require('./footer');

/**
 * Main application.  Subviews included at <RouteHandler />
 *
 */
var App = React.createClass({
  propTypes: {
    locales: React.PropTypes.array.isRequired,
    messages: React.PropTypes.object.isRequired
  },

  render () {
    return (
      <div>
        <main id='site-body' role='main'>
          <RouteHandler locales={this.props.locales} messages={this.props.messages} />
        </main>
        <Footer locales={this.props.locales} messages={this.props.messages} />
      </div>
    );
  }
});

module.exports = App;
