import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import _ from 'lodash';

import { NO_CITY } from '../../utils/constants';

export default function CompareLocationSelector(props) {
  const {
    status,
    country,
    area,
    location,
    locationsByCountry,
    selectedLocations,
    countries,
    onLocationAdd,
    onOptSelect,
    onCancel,
    onConfirm,
  } = props;

  if (status === 'none') {
    return (
      <li
        className="compare__location compare__location--actions"
        key="actions"
      >
        <button
          type="button"
          className="button-compare-location"
          onClick={onLocationAdd}
        >
          Add Location
        </button>
      </li>
    );
  } else if (status === 'selecting') {
    const {
      fetching: fetchingLocations,
      fetched: fetchedLocations,
      data: { results: locations },
    } = locationsByCountry;

    // Mental Sanity note: we use area to designate the broader region where a sensor
    // is while the API call it city.
    // Areas and Locations belonging to the selected country.
    // Will be filtered from the props.locations;
    let compareAreas = [];
    let compareLocations = [];
    const compareCountries = _.sortBy(countries, 'name');

    if (locations) {
      // Ensure that the city is present.
      // Default to NO_CITY when it is not.
      const locationsCity = locations.map(o =>
        o.city ? o : { ...o, city: NO_CITY }
      );

      compareAreas = _(locationsCity)
        .filter(o => o.country === country)
        .uniqBy('city')
        .sortBy('city')
        .value();

      if (area !== '--') {
        const [loc1, loc2] = selectedLocations;
        compareLocations = _(locationsCity)
          .filter(o => {
            // Has to belong to the correct area and can't have been selected before.
            return o.city === area && o.name !== loc1 && o.name !== loc2;
          })
          .uniqBy('name')
          .sortBy('name')
          .value();
      }
    }

    const compareAreasLabel = fetchingLocations
      ? 'Loading Data'
      : 'Select an Area';
    const compareLocationsLabel = fetchingLocations
      ? 'Loading Data'
      : compareLocations.length
      ? 'Select a Location'
      : 'No locations available';

    // Disable area while the locations are not fetched.
    const disableArea =
      !fetchedLocations || fetchingLocations || country === '--';
    // Disable locations if locations are not fetched or are not selected
    const disableLocation =
      disableArea || area === '--' || !compareLocations.length;
    // Disable confirm until everything is selected.
    const disableConfirm = disableLocation || location === '--';

    return (
      <li
        className="compare__location compare__location--actions"
        key="actions-form"
      >
        <h2>Choose Location</h2>
        <form>
          <div className="form__group">
            <label htmlFor="loc-country" className="form__label">
              Country
            </label>
            <select
              id="loc-country"
              className="form__control form__control--small"
              value={country}
              onChange={e => onOptSelect('country', e.target.value)}
            >
              <option value="--">Select a country</option>
              {compareCountries.map(o => (
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
              className="form__control form__control--small"
              value={area}
              onChange={e => onOptSelect('area', e.target.value)}
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
              className="form__control form__control--small"
              value={location}
              onChange={e => onOptSelect('location', parseInt(e.target.value))}
            >
              <option value="--">{compareLocationsLabel}</option>
              {compareLocations.map(o => (
                <option key={o.name} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form__actions">
            <button
              type="button"
              className="button button--small button--base"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className={c('button button--small button--primary', {
                disabled: disableConfirm,
              })}
              onClick={onConfirm}
            >
              Add
            </button>
          </div>
        </form>
      </li>
    );
  }
}

CompareLocationSelector.propTypes = {
  status: T.string,
  country: T.string,
  area: T.string,
  location: T.oneOfType([T.string, T.number]),
  locationsByCountry: T.object,
  selectedLocations: T.array,
  countries: T.array,
  onLocationAdd: T.func,
  onOptSelect: T.func,
  onConfirm: T.func,
  onCancel: T.func,
};
