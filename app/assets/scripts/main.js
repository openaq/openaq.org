'use strict';
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
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
import About from './views/about';
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

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route name='about' path='about' component={About} pageClass='page--about' />
        <Route name='map' path='map' component={Map} pageClass='page--map' />
        <Route name='locationsHub' path='locations' component={LocationsHub} pageClass='page--locations' />
        <Route name='location' path='location/:name' component={LocationItem} pageClass='page--location' />
        <Route name='countriesHub' path='countries' component={CountriesHub} pageClass='page--countries' />
        <Route name='country' path='countries/:name' component={Country} pageClass='page--country' />
        <Route name='country' path='compare(/:loc1)(/:loc2)(/:loc3)' component={Compare} pageClass='page--compare' />
        <IndexRoute component={Home} pageClass='page--homepage' />
      </Route>
    </Router>
  </Provider>
), document.querySelector('#app-container'));
