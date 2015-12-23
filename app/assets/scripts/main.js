'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');

// Config variables
var config = require('./config');

// Language, hard code for now, do better detection later?
var i18n = require('./i18n/en');

// Router
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;

// Components
var App = require('./components/app');
var About = require('./components/about');
var Methodology = require('./components/methodology');
var Sources = require('./components/sources');
var NotFound = require('./components/notFound');
var Home = require('./components/home');

console.log.apply(console, config.consoleMessage);
if (config.environment !== 'production') {
  console.log('--' + config.environment.toUpperCase() + '--');
}

// declare our routes and their hierarchy
var routes = (
  <Route handler={App} path='/'>
    <DefaultRoute name ='default' handler={Home} />
    <Route path='about' name='about' handler={About}/>
    <Route path='methodology' name='methodology' handler={Methodology}/>
    <Route path='sources' name='sources' handler={Sources}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDOM.render(<Handler locales={i18n.locales} messages={i18n.messages} />, document.getElementById('site-canvas'));
});
