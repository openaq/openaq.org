import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import baseData from './base-data';
import locations from './locations';
import nearbyLocations from './nearby-locations';
import baseStats from './base-stats';
import geolocation from './geolocation';

export default combineReducers({
  routing: routerReducer,
  baseData,
  locations,
  nearbyLocations,
  baseStats,
  geolocation
});
