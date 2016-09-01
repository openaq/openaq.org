import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import baseData from './base-data';
import locations from './locations';
import location from './location';
import nearbyLocations from './nearby-locations';
import baseStats from './base-stats';
import geolocation from './geolocation';
import latestMeasurements from './latest-measurements';
import measurements from './measurements';
import compare from './compare';
import locationsByCountry from './locations-by-country';
import downloadModal from './download-modal';

export default combineReducers({
  routing: routerReducer,
  baseData,
  locations,
  location,
  nearbyLocations,
  baseStats,
  geolocation,
  measurements,
  latestMeasurements,
  compare,
  locationsByCountry,
  downloadModal
});
