import * as baseData from './base-data';
import * as baseStats from './base-stats';
import * as compare from './compare';
import * as geolocation from './geolocation';
import * as projects from './projects';
import * as location from './location';
import * as locations from './locations';
import * as measurements from './measurements';
import * as locationsByCountry from './locations-by-country';
import * as downloadModal from './download-modal';
import * as voteModal from './vote-modal';

module.exports = Object.assign(
  {},
  baseData,
  baseStats,
  compare,
  geolocation,
  projects,
  location,
  locations,
  measurements,
  locationsByCountry,
  downloadModal,
  voteModal
);
