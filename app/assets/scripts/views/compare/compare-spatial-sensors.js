import React, { useState } from 'react';
import { any, PropTypes as T } from 'prop-types';
import moment from 'moment';

export default function CompareSpatialSensors(props) {
  const {
    nearbySensors,
    triggerCollocate,
    setTriggerCollocate,
    onCompareOptionsConfirm,
    children,
  } = props;

  const FILTER_TYPE_REFERENCE_GRADE = 'Reference Grade Monitor';
  const FILTER_TYPE_LOW_COST_SENSOR = 'Low-cost Sensor';

  const SORT_BY_LAST_UPDATED = 'last updated';
  const SORT_BY_PROXIMITY = 'proximity';

  // menuState = 0 -> choose between search options
  // menuState = 1 -> select sensor via query
  // menuState = 2 -> list nearby sensors (reference grade monitor vs LCS)
  const [menuState, setMenuState] = useState(0);
  const [filterType, setFilterType] = useState(FILTER_TYPE_REFERENCE_GRADE);
  const [sortType, setSortType] = useState(SORT_BY_PROXIMITY);

  const toggleFilterType = () => {
    setFilterType(
      filterType === FILTER_TYPE_REFERENCE_GRADE
        ? FILTER_TYPE_LOW_COST_SENSOR
        : FILTER_TYPE_REFERENCE_GRADE
    );
  };

  const toggleSortType = () => {
    setSortType(
      sortType === SORT_BY_PROXIMITY ? SORT_BY_LAST_UPDATED : SORT_BY_PROXIMITY
    );
  };

  return (
    <>
      {menuState !== 0 && (
        <>
          <div className="search-back-button">
            <button
              type="button"
              className="button button--small button--primary-unbounded"
              onClick={() => {
                setMenuState(0);
              }}
            >
              Back
            </button>
          </div>
        </>
      )}
      {menuState === 0 ? (
        <li className="compare__location location_selector">
          <h4>Search for new sensor to compare.</h4>
          <p>
            Select a sensor from the list or from the map below. Move map to
            view more sensors.
          </p>
          <div>
            <a
              className="button button--capsule button--primary"
              title="View the locations page with data"
              onClick={() => {
                setTriggerCollocate(!triggerCollocate);
                setMenuState(2);
              }}
            >
              List nearby sensors on map
            </a>
            <p style={{ margin: '0.5rem' }}>or</p>
            <a
              className="button button--capsule button--primary"
              title="Query for sensor"
              onClick={() => {
                setMenuState(1);
              }}
            >
              Search for sensor
            </a>
          </div>
        </li>
      ) : menuState === 1 ? (
        children
      ) : (
        <li className="compare__location location_selector">
          <h4>
            {filterType === FILTER_TYPE_REFERENCE_GRADE
              ? 'Nearby reference-grade monitors'
              : 'Nearby low-cost sensors'}
          </h4>
          <div>
            Filter type: {filterType}{' '}
            <a onClick={toggleFilterType}>[ change ]</a>
          </div>
          <div>
            Sort by: {sortType} <a onClick={toggleSortType}>[ change ]</a>
          </div>
          <div>
            {filterType === FILTER_TYPE_REFERENCE_GRADE ? (
              <div>
                <div>
                  {
                    nearbySensors.filter(
                      sensor =>
                        sensor.properties.sensorType === 'reference grade'
                    ).length
                  }{' '}
                  sensors found
                  <a
                    onClick={() => {
                      setTriggerCollocate(!triggerCollocate);
                    }}
                  >
                    {' '}
                    [ Refresh search ]
                  </a>
                </div>
                {nearbySensors.filter(
                  sensor => sensor.properties.sensorType === 'reference grade'
                ).length > 0 ? (
                  <div className="collocation-sensors-list">
                    {nearbySensors
                      .filter(
                        sensor =>
                          sensor.properties.sensorType === 'reference grade'
                      )
                      .sort((a, b) => {
                        if (sortType === SORT_BY_PROXIMITY) {
                          return a.distance - b.distance;
                        } else {
                          return moment(b.properties.lastUpdated).diff(
                            moment(a.properties.lastUpdated)
                          );
                        }
                      })
                      .map((sensor, index) => (
                        <div
                          className="collocate-sensor"
                          onClick={() => {
                            onCompareOptionsConfirm(
                              sensor.properties.locationId
                            );
                          }}
                          key={index}
                        >
                          <span>{sensor.distance.toFixed(2)} miles away</span>,
                          updated{' '}
                          {moment(sensor.properties.lastUpdated).fromNow()}.
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="collocation-sensors-list">
                    <p>
                      No reference grade monitors were found within the map
                      view. Try moving the map or changing the parameter.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div>
                  {
                    nearbySensors.filter(
                      sensor =>
                        sensor.properties.sensorType !== 'reference grade'
                    ).length
                  }{' '}
                  sensors found
                  <a
                    onClick={() => {
                      setTriggerCollocate(!triggerCollocate);
                    }}
                  >
                    {' '}
                    [ Refresh search ]
                  </a>
                </div>
                {nearbySensors.filter(
                  sensor => sensor.properties.sensorType !== 'reference grade'
                ).length > 0 ? (
                  <div className="collocation-sensors-list">
                    {nearbySensors
                      .filter(
                        sensor =>
                          sensor.properties.sensorType !== 'reference grade'
                      )
                      .sort((a, b) => {
                        if (sortType === SORT_BY_PROXIMITY) {
                          return a.distance - b.distance;
                        } else {
                          return moment(b.properties.lastUpdated).diff(
                            moment(a.properties.lastUpdated)
                          );
                        }
                      })
                      .map((sensor, index) => (
                        <div
                          className="collocate-sensor"
                          onClick={() => {
                            onCompareOptionsConfirm(
                              sensor.properties.locationId
                            );
                          }}
                          key={index}
                        >
                          <span>{sensor.distance.toFixed(2)} miles away</span>,
                          updated{' '}
                          {moment(sensor.properties.lastUpdated).fromNow()}.
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="collocation-sensors-list">
                    <p>
                      No low-cost sensors were found within the map view. Try
                      moving the map or changing the parameter.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </li>
      )}
    </>
  );
}

CompareSpatialSensors.propTypes = {
  nearbySensors: T.array,
  triggerCollocate: T.func,
  setTriggerCollocate: T.func,
  onCompareOptionsConfirm: T.func,
  children: any,
};
