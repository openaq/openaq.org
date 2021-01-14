'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _ from 'lodash';

import { NO_CITY } from '../../utils/constants';

export default function LocationSelector(props) {
  const {
    countries,
    fetching,
    fetched,
    locations,
    locCountry,
    locArea,
    locLocation,
    onOptSelect,
  } = props;

  // Mental Sanity note: we use area to designate the broader region where a sensor
  // is while the API call it city.
  // Areas and Locations belonging to the selected country.
  // Will be filtered from the props.locations;
  let compareAreas = [];
  let compareLocations = [];

  if (locations) {
    // Ensure that the city is present.
    // Default to NO_CITY when it is not.
    const locationsCity = locations.map(o =>
      o.city ? o : { ...o, city: NO_CITY }
    );

    compareAreas = _(locationsCity)
      .filter(o => o.country === locCountry)
      .uniqBy('city')
      .sortBy('city')
      .value();

    if (locArea !== '--') {
      compareLocations = _(locationsCity)
        .filter(o => {
          // Has to belong to the correct area and can't have been selected before.
          return o.city === locArea;
        })
        .uniqBy('name')
        .sortBy('name')
        .value();
    }
  }

  const compareAreasLabel = fetching ? 'Loading Data' : 'Select an Area';
  const compareLocationsLabel = fetching ? 'Loading Data' : 'Select a Location';

  // Disable area while the locations are not fetched.
  const disableArea = !fetched || fetching;
  // Disable locations if locations are not fetched or are not selected
  const disableLocation = disableArea || locArea === '--';

  return (
    <fieldset className="form__fieldset form__fieldset--location">
      <legend className="form__legend">Location Selector</legend>
      <div className="form__group">
        <label htmlFor="loc-country" className="form__label">
          Country
        </label>
        <select
          id="loc-country"
          className="form__control form__control--medium select--base-bounded"
          value={locCountry}
          onChange={e => onOptSelect('locCountry', e)}
        >
          <option value="--">Select a Country</option>
          {countries.map(o => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <div className={c('form__group', { disabled: disableArea })}>
        <label htmlFor="loc-area" className="form__label">
          Area
        </label>
        <select
          id="loc-area"
          className="form__control form__control--medium select--base-bounded"
          value={locArea}
          onChange={e => onOptSelect('locArea', e)}
        >
          <option value="--">{compareAreasLabel}</option>
          {compareAreas.map(o => (
            <option key={o.city} value={o.city}>
              {o.city}
            </option>
          ))}
        </select>
      </div>
      <div className={c('form__group', { disabled: disableLocation })}>
        <label htmlFor="loc-location" className="form__label">
          Location
        </label>
        <select
          id="loc-location"
          className="form__control form__control--medium select--base-bounded"
          value={locLocation}
          onChange={e => onOptSelect('locLocation', e)}
        >
          <option value="--">{compareLocationsLabel}</option>
          {compareLocations.map(o => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}

LocationSelector.propTypes = {
  countries: T.array,
  fetching: T.bool,
  fetched: T.bool,
  locations: T.array,
  locCountry: T.string,
  locArea: T.string,
  locLocation: T.string,
  onOptSelect: T.func,
};
