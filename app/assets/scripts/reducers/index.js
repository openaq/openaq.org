import { combineReducers } from 'redux';
import baseData from './base-data';
import projects from './projects';
import locations from './locations';
import location from './location';
import nearbyLocations from './nearby-locations';
import baseStats from './base-stats';
import geolocation from './geolocation';
import latestMeasurements from './latest-measurements';
import averageMeasurements from './average-measurements';
import measurements from './measurements';
import compare from './compare';
import locationsByCountry from './locations-by-country';
import downloadModal from './download-modal';
import voteModal from './vote-modal';

export default combineReducers({
  baseData,
  projects,
  locations,
  location,
  nearbyLocations,
  baseStats,
  geolocation,
  measurements,
  latestMeasurements,
  averageMeasurements,
  compare,
  locationsByCountry,
  downloadModal,
  voteModal,
});
