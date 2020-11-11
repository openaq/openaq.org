import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducers/index';
import { fetchBaseData, fetchBaseStats } from './actions/action-creators';

import ScrollToTop from './components/scroll-to-top';
import App from './views/app';
import Home from './views/home';
import Why from './views/why';
import About from './views/about';
import CommunityHub from './views/community-hub';
import CommunityProjects from './views/community-projects';
import CommunityWorkshops from './views/community-workshops';
import Map from './views/map';
import LocationsHub from './views/locations-hub';
import LocationItem from './views/location';
import CountriesHub from './views/countries-hub';
import Country from './views/country';
import Compare from './views/compare';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return process.env.NODE_ENV !== 'production';
  }
});

const composeEnhancers =
  process.env.NODE_ENV !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const middlewares = applyMiddleware(thunkMiddleware, logger);

const store = createStore(reducer, {}, composeEnhancers(middlewares));

// Base data.
store.dispatch(fetchBaseData());
store.dispatch(fetchBaseStats());

render(
  <Provider store={store}>
    <Router>
      <ScrollToTop />
      <App>
        <Switch>
          <Route
            name="why"
            path="/why"
            component={Why}
            pageClass="page--why page--dark"
          />
          <Route
            name="about"
            path="/about"
            component={About}
            pageClass="page--about page--dark"
          />
          <Route
            name="communityProjects"
            path="/community/projects"
            component={CommunityProjects}
            pageClass="page--community-projects"
          />
          <Route
            name="communityWorkshops"
            path="/community/workshops"
            component={CommunityWorkshops}
            pageClass="page--community-workshops"
          />
          <Route
            name="communityHub"
            path="/community"
            component={CommunityHub}
            pageClass="page--community-hub page--dark"
          />
          <Route name="map" path="/map" component={Map} pageClass="page--map" />
          <Route
            name="location"
            path="/location/:name"
            component={LocationItem}
            pageClass="page--locations-single page--dark"
          />
          <Route
            name="locationsHub"
            path="/locations"
            component={LocationsHub}
            pageClass="page--locations-hub page--dark"
          />
          <Route
            name="country"
            path="/countries/:name"
            component={Country}
            pageClass="page--countries-single page--dark"
          />
          <Route
            name="countriesHub"
            path="/countries"
            component={CountriesHub}
            pageClass="page--countries-hub page--dark"
          />
          <Route
            name="country"
            path="/compare(/:loc1)(/:loc2)(/:loc3)"
            component={Compare}
            pageClass="page--compare"
          />
          <Route
            path="/"
            component={Home}
            pageClass="page--homepage page--dark"
          ></Route>
        </Switch>
      </App>
    </Router>
  </Provider>,
  document.querySelector('#app-container')
);
