'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { syncHistoryWithStore } from 'react-router-redux';
import createLogger from 'redux-logger';
// import {whyDidYouUpdate} from 'why-did-you-update';
import reducer from './reducers/index';
import { fetchBaseData, fetchBaseStats } from './actions/action-creators';

if (process.env.NODE_ENV !== 'production') {
  // whyDidYouUpdate(React, { exclude: /Scroll/ });
}

import App from './views/app';
import Home from './views/home';
import Why from './views/why';
import About from './views/about';
import CommunityHub from './views/community-hub';
import CommunityProjects from './views/community-projects';
import Map from './views/map';
import LocationsHub from './views/locations-hub';
import LocationItem from './views/location';
import CountriesHub from './views/countries-hub';
import Country from './views/country';
import Compare from './views/compare';

const logger = createLogger();
const store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));
const history = syncHistoryWithStore(hashHistory, store);

// Base data.
store.dispatch(fetchBaseData());
store.dispatch(fetchBaseStats());

const scrollerMiddleware = useScroll((prevRouterProps, currRouterProps) => {
  return prevRouterProps &&
    decodeURIComponent(currRouterProps.location.pathname) !== decodeURIComponent(prevRouterProps.location.pathname);
});

render((
  <Provider store={store}>
    <Router history={history} render={applyRouterMiddleware(scrollerMiddleware)}>
      <Route path='/' component={App}>
        <Route name='why' path='why' component={Why} pageClass='page--why page--dark' />
        <Route name='about' path='about' component={About} pageClass='page--about' />
        <Route name='communityHub' path='community' component={CommunityHub} pageClass='page--community-hub page--dark' />
        <Route name='communityProjects' path='community/projects' component={CommunityProjects} pageClass='page--community-projects page--dark' />
        <Route name='map' path='map' component={Map} pageClass='page--map' />
        <Route name='locationsHub' path='locations' component={LocationsHub} pageClass='page--locations page--dark' />
        <Route name='location' path='location/:name' component={LocationItem} pageClass='page--location page--dark' />
        <Route name='countriesHub' path='countries' component={CountriesHub} pageClass='page--countries page--dark' />
        <Route name='country' path='countries/:name' component={Country} pageClass='page--country' />
        <Route name='country' path='compare(/:loc1)(/:loc2)(/:loc3)' component={Compare} pageClass='page--compare' />
        <IndexRoute component={Home} pageClass='page--homepage page--dark' />
      </Route>
    </Router>
  </Provider>
), document.querySelector('#app-container'));
