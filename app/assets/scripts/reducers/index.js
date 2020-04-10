import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import baseData from './base-data';
import landscape from './landscape';
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
import voteModal from './vote-modal';

export default combineReducers({
  routing: routerReducer,
  baseData,
  landscape,
  locations,
  location,
  nearbyLocations,
  baseStats,
  geolocation,
  measurements,
  latestMeasurements,
  compare,
  locationsByCountry,
  downloadModal,
  voteModal
});
