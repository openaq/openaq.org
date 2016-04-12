var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

/**
 * Main application.  Subviews included at <RouteHandler />
 *
 */
var App = React.createClass({
  propTypes: {
    locales: React.PropTypes.array.isRequired,
    messages: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div>
        <main id='site-body' role='main'>
          <RouteHandler locales={this.props.locales} messages={this.props.messages} />
        </main>
      </div>
    );
  }
});

module.exports = App;
