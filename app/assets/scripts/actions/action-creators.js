import * as baseData from './base-data';
import * as baseStats from './base-stats';
import * as compare from './compare';
import * as geolocation from './geolocation';
import * as latestMeasurements from './latest-measurements';
import * as location from './location';
import * as locations from './locations';
import * as measurements from './measurements';
import * as nearbyLocations from './nearby-locations';

module.exports = Object.assign({},
  baseData,
  baseStats,
  compare,
  geolocation,
  latestMeasurements,
  location,
  locations,
  measurements,
  nearbyLocations
);
