import React, { useEffect, useMemo } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import c from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import qs from 'qs';
import { Dropdown } from 'openaq-design-system';
import * as d3 from 'd3';

import {
  fetchCompareLocationIfNeeded,
  removeCompareLocation,
  selectCompareOptions,
  cancelCompareOptions,
  selectCompareCountry,
  selectCompareArea,
  selectCompareLocation,
  fetchLocationsByCountry,
  invalidateLocationsByCountry,
  fetchCompareLocationMeasurements,
  invalidateCompare,
} from '../actions/action-creators';
import LoadingMessage from '../components/loading-message';
import InfoMessage from '../components/info-message';
import ChartBrush from '../components/chart-brush';

import { NO_CITY, PM25_PARAMETER_ID } from '../utils/constants';

function Compare(props) {
  const {
    match,
    location,
    history,
    compareLoc,
    parameters,
    countries,
    locationsByCountry,
    compareMeasurements,
    compareSelectOpts,

    _invalidateCompare,
    _removeCompareLocation,
    _fetchCompareLocationIfNeeded,
    _fetchCompareLocationMeasurements,
    _cancelCompareOptions,
    _invalidateLocationsByCountry,
    _fetchLocationsByCountry,
    _selectCompareOptions,
    _selectCompareCountry,
    _selectCompareArea,
    _selectCompareLocation,
  } = props;

  // Data for the active parameter or default to PM25
  const activeParameterData = useMemo(() => {
    const query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    const parameterData = _.find(parameters, {
      id: Number(query.parameter),
    });
    return parameterData || _.find(parameters, { id: PM25_PARAMETER_ID });
  }, [location.search, parameters]);

  // Returns an array with the ids of the locations being compared.
  // It also accepts a filter function to further remove locations.
  // Mostly used to construct the url.
  const getLocIds = filter =>
    compareLoc
      .filter((o, i) => {
        if (!o.data) return false;
        if (filter) return filter(o, i);
        return true;
      })
      .map(o => o.data.id);

  const onParameterSelect = parameter => {
    const locsUrl = getLocIds().map(encodeURIComponent).join('/');
    history.push(`/compare/${locsUrl}?parameter=${parameter}`);
  };

  const onLocationRemove = index => {
    // To build the url filter out the location at the given index.
    // Ensure that non loaded locations are also out.
    const locsUrl = getLocIds((_o, i) => i !== index)
      .map(encodeURIComponent)
      .join('/');

    history.push(`/compare/${locsUrl}?parameter=${activeParameterData.id}`);
  };

  const onCompareOptSelect = (key, value) => {
    switch (key) {
      case 'country':
        _invalidateLocationsByCountry();
        _selectCompareCountry(value);
        _fetchLocationsByCountry(value);
        break;
      case 'area':
        _selectCompareArea(value);
        break;
      case 'location':
        _selectCompareLocation(value);
        break;
    }
  };

  const onCompareOptionsConfirm = () => {
    _cancelCompareOptions();

    const locsUrl = [...getLocIds(), compareSelectOpts.location]
      .map(encodeURIComponent)
      .join('/');

    history.push(`/compare/${locsUrl}?parameter=${activeParameterData.id}`);
  };

  const fetchLocationData = (index, loc) => {
    _fetchCompareLocationIfNeeded(index, loc).then(res => {
      if (!res.error) {
        const toDate = moment.utc();
        const fromDate = toDate.clone().subtract(8, 'days');
        const locId = res.json.id;
        _fetchCompareLocationMeasurements(
          index,
          locId,
          fromDate.toISOString(),
          toDate.toISOString()
        );
      }
    });
  };

  useEffect(() => {
    // No mount action.
    // On unmount cleanup the compare.
    return () => _invalidateCompare();
  }, []);

  // Fetch data for all locations being compared.
  // Locations are stored using their index, and this order never changes.
  const { loc1, loc2, loc3 } = match.params;
  const selectedLocations = useMemo(() => [loc1, loc2, loc3], [
    loc1,
    loc2,
    loc3,
  ]);
  selectedLocations.forEach((l, idx) => {
    useEffect(() => {
      if (l) {
        fetchLocationData(idx, l);
      } else {
        _removeCompareLocation(idx);
      }
    }, [l]);
  });

  const locs = compareLoc.filter(o => o.fetched || o.fetching);

  // Get all the parameter available in the locations for the dropdown.
  const locParamsIds = compareLoc.reduce((acc, location) => {
    if (!location.fetched || location.fetching || location.error) return acc;
    return location.data.parameters.reduce(
      (_acc, p) => _acc.add(p.parameterId),
      acc
    );
  }, new Set());

  const locParams = Array.from(locParamsIds).map(id =>
    parameters.find(p => p.id === id)
  );

  return (
    <section className="inpage">
      <header className="inpage__header">
        <div className="inner">
          <div className="inpage__headline">
            <h1 className="inpage__title">Compare locations</h1>
          </div>

          <div className="compare">
            <ul className="compare__location-list">
              {locs.map((o, i) => (
                <CompareLocation
                  locationIndex={i}
                  countries={countries}
                  onRemove={onLocationRemove}
                  location={o}
                  key={i}
                />
              ))}
              {locs.length < 3 && (
                <CompareLocationSelector
                  status={compareSelectOpts.status}
                  country={compareSelectOpts.country}
                  area={compareSelectOpts.area}
                  location={compareSelectOpts.location}
                  locationsByCountry={locationsByCountry}
                  selectedLocations={selectedLocations}
                  countries={countries}
                  onLocationAdd={_selectCompareOptions}
                  onOptSelect={onCompareOptSelect}
                  onConfirm={onCompareOptionsConfirm}
                  onCancel={_cancelCompareOptions}
                />
              )}
            </ul>
          </div>
        </div>
      </header>
      <div className="inpage__body">
        {locs.length ? (
          <section className="fold" id="compare-fold-measurements">
            <div className="inner">
              <header className="fold__header">
                <h1 className="fold__title">Comparing measurements</h1>
                <div className="fold__introduction">
                  <ParameterSelector
                    activeParam={activeParameterData}
                    parameters={locParams}
                    onSelect={onParameterSelect}
                  />
                  <AvailabilityMessage
                    activeParam={activeParameterData}
                    compareLocations={compareLoc}
                  />
                </div>
              </header>
              <div className="fold__body">
                <CompareBrushChart
                  activeParam={activeParameterData}
                  compareMeasurements={compareMeasurements}
                  compareLocations={compareLoc}
                />
              </div>
              <small className="disclaimer">
                <a href="https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85">
                  Data Disclaimer and More Information
                </a>
              </small>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

Compare.propTypes = {
  _fetchCompareLocationIfNeeded: T.func,
  _removeCompareLocation: T.func,
  _selectCompareOptions: T.func,
  _cancelCompareOptions: T.func,
  _selectCompareCountry: T.func,
  _selectCompareArea: T.func,
  _selectCompareLocation: T.func,
  _fetchLocationsByCountry: T.func,
  _invalidateLocationsByCountry: T.func,
  _invalidateCompare: T.func,
  _fetchCompareLocationMeasurements: T.func,

  match: T.object,
  location: T.object,
  history: T.object,

  params: T.object,
  countries: T.array,
  parameters: T.array,

  compareLoc: T.array,
  compareMeasurements: T.array,
  compareSelectOpts: T.object,

  locationsByCountry: T.object,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    countries: state.baseData.data.countries,
    parameters: state.baseData.data.parameters,

    compareLoc: state.compare.locations,
    compareSelectOpts: state.compare.compareSelectOpts,
    compareMeasurements: state.compare.measurements,

    locationsByCountry: state.locationsByCountry,
  };
}

function dispatcher(d) {
  return {
    _selectCompareOptions: (...args) => d(selectCompareOptions(...args)),
    _cancelCompareOptions: (...args) => d(cancelCompareOptions(...args)),

    _selectCompareCountry: (...args) => d(selectCompareCountry(...args)),
    _selectCompareArea: (...args) => d(selectCompareArea(...args)),
    _selectCompareLocation: (...args) => d(selectCompareLocation(...args)),

    _fetchLocationsByCountry: (...args) => d(fetchLocationsByCountry(...args)),
    _invalidateLocationsByCountry: (...args) =>
      d(invalidateLocationsByCountry(...args)),

    _invalidateCompare: (...args) => d(invalidateCompare(...args)),

    _fetchCompareLocationIfNeeded: (...args) =>
      d(fetchCompareLocationIfNeeded(...args)),
    _removeCompareLocation: (...args) => d(removeCompareLocation(...args)),

    _fetchCompareLocationMeasurements: (...args) =>
      d(fetchCompareLocationMeasurements(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Compare);

// /////////////////////////////////////////////////////////////////// //
// Helper components

function CompareLocation(props) {
  const { locationIndex, location, countries, onRemove } = props;

  if (location.fetching) {
    return (
      <li className="compare__location">
        <LoadingMessage type="minimal" />
      </li>
    );
  }

  if (location.error) {
    return (
      <li className="compare__location">
        <InfoMessage standardMessage />
      </li>
    );
  }

  const d = location.data;
  const kl = ['compare-marker--st', 'compare-marker--nd', 'compare-marker--rd'];
  const updated = moment(d.lastUpdated).fromNow();
  const countryData = _.find(countries, { code: d.country });
  return (
    <li className="compare__location" key={d.id}>
      <p className="compare__subtitle">Updated {updated}</p>
      <h2 className="compare__title">
        <Link to={`/location/${encodeURIComponent(d.id)}`}>
          <span className={c('compare-marker', kl[locationIndex])}>
            {d.name}
          </span>
        </Link>{' '}
        <small>
          in {d.city || NO_CITY}, {countryData.name}
        </small>
      </h2>
      <p className="compare-parameters">
        Reporting: {d.parameters.map(p => p.displayName).join(', ')}
      </p>
      <div className="compare__actions">
        <button
          type="button"
          className="button button--small button--primary-unbounded"
          onClick={() => onRemove(locationIndex)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

CompareLocation.propTypes = {
  locationIndex: T.number,
  location: T.object,
  countries: T.array,
  onRemove: T.func,
};

function CompareLocationSelector(props) {
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

function ParameterSelector(props) {
  const { activeParam, parameters, onSelect } = props;

  const drop = (
    <Dropdown
      triggerElement="button"
      triggerClassName="button button--base-unbounded drop__toggle--caret"
      triggerTitle="Show/hide parameter options"
      triggerText={activeParam.displayName}
    >
      <ul role="menu" className="drop__menu drop__menu--select scrollable">
        {parameters.map(o => (
          <li key={o.id}>
            <a
              className={c('drop__menu-item', {
                'drop__menu-item--active': activeParam.id === o.id,
              })}
              href="#"
              title={`Show values for ${o.displayName}`}
              data-hook="dropdown:close"
              onClick={e => {
                e.preventDefault();
                onSelect(o.id);
              }}
            >
              <span>{o.displayName}</span>
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  );

  return <p>Comparing {drop} values for local times</p>;
}

ParameterSelector.propTypes = {
  activeParam: T.object,
  parameters: T.array,
  onSelect: T.func,
};

function AvailabilityMessage(props) {
  const { activeParam, compareLocations } = props;
  // Prepare data.
  const weekAgo = moment().subtract(7, 'days').toISOString();
  const messages = compareLocations
    .filter(o => o.fetched && !o.fetching && o.data)
    .map(o => {
      if (!o.data.parameters.find(p => p.parameterId === activeParam.id)) {
        return (
          <p key={o.data.id}>
            {o.data.name} does not report {activeParam.displayName}.
          </p>
        );
      }

      if (o.data.lastUpdated < weekAgo) {
        return (
          <p key={o.data.id}>
            {o.data.name} has not reported values in the last week.
          </p>
        );
      }

      return null;
    })
    .filter(o => o !== null);

  return <div className="compare__info-msg">{messages}</div>;
}

AvailabilityMessage.propTypes = {
  activeParam: T.object,
  compareLocations: T.array,
};

function CompareBrushChart(props) {
  const { activeParam, compareLocations, compareMeasurements } = props;

  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const userNow = moment().format(dateFormat);
  const weekAgo = moment().subtract(7, 'days').format(dateFormat);

  // Prepare data.
  const chartData = useMemo(() => {
    return _(compareMeasurements)
      .map((o, locIdx) => {
        if (o.fetched && !o.fetching && o.data) {
          return o.data.results
            .filter(res => {
              // The result parameter has to be on the location reported
              // parameter list and has to be the same as the active one.
              const locParamList = compareLocations[locIdx].data.parameters;
              const resParamInList = locParamList.find(
                p => p.parameterId === res.parameterId
              );
              if (!resParamInList || res.parameterId !== activeParam.id) {
                return false;
              }

              if (res.average < 0) return false;
              const measurementDate = moment(res.hour).format(dateFormat);
              return measurementDate >= weekAgo && measurementDate <= userNow;
            })
            .map(o => {
              // Map data according to chart needs.
              return {
                value: o.average,
                date: {
                  localNoTZ: new Date(o.hour),
                },
              };
            });
        } else {
          return null;
        }
      })
      .filter(Boolean)
      .value();
  }, [activeParam.name, compareMeasurements, compareLocations]);

  const yMax = d3.max(chartData || [], r => d3.max(r, o => o.value)) || 0;

  // 1 Week.
  const xRange = [moment().subtract(7, 'days').toDate(), moment().toDate()];

  // Only show the "no results" message if measurements have loaded.
  const fetchedMeasurements = compareMeasurements.filter(
    o => o.fetched && !o.fetching
  );
  if (fetchedMeasurements.length) {
    const dataCount = chartData.reduce((prev, curr) => prev + curr.length, 0);

    if (!dataCount) {
      return (
        <InfoMessage>
          <p>There are no data for the selected parameter.</p>
          <p>
            Maybe you&apos;d like to suggest a{' '}
            <a
              href="https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform"
              title="Suggest a new source"
            >
              new source
            </a>
            .
          </p>
        </InfoMessage>
      );
    }
  }

  return (
    <ChartBrush
      className="brush-chart"
      data={chartData}
      xRange={xRange}
      yRange={[0, yMax]}
      yLabel={activeParam.preferredUnit}
    />
  );
}

CompareBrushChart.propTypes = {
  activeParam: T.object,
  compareMeasurements: T.array,
  compareLocations: T.array,
};
