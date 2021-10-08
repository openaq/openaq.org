import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducers/index';

import ScrollToTop from './components/scroll-to-top';
import App from './views/app';
import Home from './views/home';
import Why from './views/why';
import About from './views/about';
import Donate from './views/donate';
import CommunityHub from './views/community-hub';
import CommunityProjects from './views/community-projects';
import CommunityWorkshops from './views/community-workshops';
import Ambassadors from './views/ambassadors';
import WorldMap from './views/world-map';
import LocationsHub from './views/locations-hub';
import LocationItem from './views/location';
import CountriesHub from './views/countries-hub';
import Country from './views/country';
import ProjectsHub from './views/projects-hub';
import Project from './views/project';
import Compare from './views/compare';
import Collocate from './views/collocate';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: () => {
    return process.env.NODE_ENV !== 'production';
  },
});

const composeEnhancers =
  process.env.NODE_ENV !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const middlewares = applyMiddleware(thunkMiddleware, logger);

const store = createStore(reducer, {}, composeEnhancers(middlewares));

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
            name="ambassadors"
            path="/community/ambassadors"
            component={Ambassadors}
            pageClass="page--ambassadors page--dark"
          />
          <Route
            name="communityHub"
            path="/community"
            component={CommunityHub}
            pageClass="page--community-hub page--dark"
          />
          <Route
            name="map"
            path="/map"
            component={WorldMap}
            pageClass="page--map"
          />
          <Route
            name="donate"
            path="/donate"
            component={Donate}
            pageClass="page--donate"
          />
          <Route
            name="location"
            path="/location/:id"
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
            path="/compare/:loc1?/:loc2?/:loc3?"
            component={Compare}
            pageClass="page--compare"
          />
          <Route
            name="country"
            path="/collocate/:loc1?/:loc2?/:loc3?"
            component={Collocate}
            pageClass="page--collocate"
          />
          <Route
            name="projectsHub"
            path="/project/:id"
            component={Project}
            pageClass="page--projects-single page--dark"
          />
          <Route
            name="projectsHub"
            path="/projects"
            component={ProjectsHub}
            pageClass="page--projects-hub page--dark"
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
