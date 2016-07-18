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
import {whyDidYouUpdate} from 'why-did-you-update';
import reducer from './reducers/index';

if (process.env.NODE_ENV !== 'production') {
  whyDidYouUpdate(React);
}

import App from './views/app';
import Home from './views/home';
import About from './views/about';
import Map from './views/map';

const logger = createLogger();
const store = createStore(reducer, applyMiddleware(thunkMiddleware, logger));
const history = syncHistoryWithStore(hashHistory, store);

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='about' component={About} pageClass='page--about' />
        <Route path='map' component={Map} pageClass='page--map' />
        <IndexRoute component={Home} pageClass='page--homepage' />
      </Route>
    </Router>
  </Provider>
), document.querySelector('#app-container'));
