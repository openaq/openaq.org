import * as baseData from './base-data';
import * as baseStats from './base-stats';
import * as compare from './compare';
import * as geolocation from './geolocation';
import * as latestMeasurements from './latest-measurements';
import * as averageMeasurements from './average-measurements';
import * as location from './location';
import * as locations from './locations';
import * as measurements from './measurements';
import * as nearbyLocations from './nearby-locations';
import * as locationsByCountry from './locations-by-country';
import * as downloadModal from './download-modal';
import * as voteModal from './vote-modal';

module.exports = Object.assign(
  {},
  baseData,
  baseStats,
  compare,
  geolocation,
  latestMeasurements,
  averageMeasurements,
  location,
  locations,
  measurements,
  nearbyLocations,
  locationsByCountry,
  downloadModal,
  voteModal
);
