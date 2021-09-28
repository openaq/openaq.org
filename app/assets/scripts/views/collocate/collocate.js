import React, { useState, useEffect, useMemo } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import qs from 'qs';
import * as turf from '@turf/turf';

import CompareLocationSelector from '../compare/compare-location-selector';
import CompareSpatialSensors from '../compare/compare-spatial-sensors';
import CompareLocation from '../compare/compare-location';
import ParameterSelector from '../compare/parameter-selector';
import AvailabilityMessage from '../compare/availability-message';
import CompareBrushChart from '../compare/compare-brush-chart';
import CompareStatistics from '../compare/compare-statistics';

import CollocationMap from './collocation-map';

import {
  fetchBaseData,
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
} from '../../actions/action-creators';
import { PM25_PARAMETER_ID } from '../../utils/constants';

function Collocate(props) {
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
    _fetchBaseData,
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

  // Use to trigger finding nearby sensors in mapbox
  const [triggerCollocate, setTriggerCollocate] = useState(false);
  const [nearbySensors, setNearbySensors] = useState([]);

  useEffect(() => {
    if (!parameters) {
      _fetchBaseData();
    }
    // On unmount cleanup the compare.
    return () => _invalidateCompare();
  }, []);

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
    history.push(`/collocate/${locsUrl}?parameter=${parameter}`);
  };

  const onLocationRemove = index => {
    // To build the url filter out the location at the given index.
    // Ensure that non loaded locations are also out.
    const locsUrl = getLocIds((_o, i) => i !== index)
      .map(encodeURIComponent)
      .join('/');

    history.push(`/collocate/${locsUrl}?parameter=${activeParameterData.id}`);
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

  const onCompareOptionsConfirm = locationId => {
    _cancelCompareOptions();

    const locsUrl = [...getLocIds(), locationId]
      .map(encodeURIComponent)
      .join('/');

    history.push(`/collocate/${locsUrl}?parameter=${activeParameterData.id}`);
  };

  const fetchLocationData = (index, loc) => {
    _fetchCompareLocationIfNeeded(index, loc).then(res => {
      if (!res.error) {
        const toDate = moment.utc();
        const fromDate = toDate.clone().subtract(21, 'days');
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
    parameters?.find(p => p.id === id)
  );

  return (
    <section className="inpage">
      <header className="inpage__header choose-sensors-wrapper">
        <div className="inner">
          <div className="inpage__headline">
            <h1 className="inpage__title">Compare locations</h1>
          </div>

          <div className="compare">
            <ul className="compare__location-list">
              {locs.length === 0 && (
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
              {locs.map((o, i) => (
                <CompareLocation
                  locationIndex={i}
                  countries={countries}
                  onRemove={onLocationRemove}
                  location={o}
                  key={i}
                />
              ))}
              {locs.length === 1 &&
                locs.length &&
                compareLoc.length > 0 &&
                compareLoc[0].data &&
                compareLoc[0].data.coordinates && (
                  <CompareSpatialSensors
                    nearbySensors={nearbySensors}
                    onCompareOptionsConfirm={onCompareOptionsConfirm}
                    setTriggerCollocate={setTriggerCollocate}
                    triggerCollocate={triggerCollocate}
                  >
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
                  </CompareSpatialSensors>
                )}
            </ul>
          </div>
        </div>
      </header>
      <div className="inpage__body">
        {locs.length &&
          compareLoc.length > 0 &&
          compareLoc[0].data &&
          compareLoc[0].data.coordinates && (
            <CollocationMap
              locationId={compareLoc[0].data.id}
              center={[
                compareLoc[0].data.coordinates.longitude,
                compareLoc[0].data.coordinates.latitude,
              ]}
              parameters={compareLoc[0].data.parameters}
              initialActiveParameter={compareLoc[0].data.parameters[0]}
              // trigger a mapbox render query
              popupFunction={locationId => {
                onCompareOptionsConfirm(locationId);
              }}
              triggerCollocate={triggerCollocate}
              findNearbySensors={features => {
                console.log(features);
                const from = turf.point([
                  compareLoc[0].data.coordinates.longitude,
                  compareLoc[0].data.coordinates.latitude,
                ]);
                const newFeatures = [];
                features.forEach(feature => {
                  const to = turf.point(feature.geometry.coordinates);
                  const options = { units: 'miles' };
                  const distance = turf.distance(from, to, options);
                  feature.distance = distance;
                  if (distance !== 0) {
                    newFeatures.push(feature);
                  }
                });
                console.log('setNearbySensors', newFeatures);
                setNearbySensors(newFeatures);
              }}
            />
          )}
      </div>
      <div className="inpage__body">
        {activeParameterData && locs.length ? (
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
                <CompareStatistics
                  activeParam={activeParameterData}
                  compareMeasurements={compareMeasurements}
                  compareLocations={compareLoc}
                />
              </div>
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

Collocate.propTypes = {
  _fetchBaseData: T.func,
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
    _fetchBaseData: (...args) => d(fetchBaseData(...args)),
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

module.exports = connect(selector, dispatcher)(Collocate);
