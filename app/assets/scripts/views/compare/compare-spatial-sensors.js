import React, { useState } from 'react';
import { any, PropTypes as T } from 'prop-types';
import moment from 'moment';

export default function CompareSpatialSensors(props) {
  const {
    nearbySensors,
    triggerCompareSearch,
    setTriggerCompareSearch,
    onCompareSpatialOptionsConfirm,
    compareLocations,
    children,
  } = props;

  const FILTER_TYPE_REFERENCE_GRADE = 'Reference Grade Monitor';
  const FILTER_TYPE_LOW_COST_SENSOR = 'Low-cost Sensor';

  const SORT_BY_LAST_UPDATED = 'last updated';
  const SORT_BY_PROXIMITY = 'proximity';

  // menuState = 0 -> click add sensor
  // menuState = 2 -> select sensor via query
  // menuState = 3 -> list nearby sensors (reference grade monitor vs LCS)

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
      {menuState === 2 && (
        <div className="search-back-button">
          <button
            type="button"
            className="button button--small button--primary-unbounded"
            onClick={() => {
              setTriggerCompareSearch(!triggerCompareSearch);
              setMenuState(3);
            }}
          >
            Search for sensor using map.
          </button>
        </div>
      )}
      {menuState === 0 ? (
        <li
          className="compare__location compare__location--actions"
          key="actions"
        >
          <button
            type="button"
            className="button-compare-location"
            onClick={() => {
              setTriggerCompareSearch(!triggerCompareSearch);
              setMenuState(3);
            }}
          >
            Add Location
          </button>
        </li>
      ) : menuState === 2 ? (
        children
      ) : (
        <li className="compare__location location_selector location_selector_spatial">
          <div className="search-back-button">
            <button
              type="button"
              className="button button--small button--primary-unbounded"
              onClick={() => {
                setMenuState(2);
              }}
            >
              Search for sensor via query.
            </button>
          </div>
          <div>
            {['reference grade', 'low-cost sensor'].map((sensorType, index) => {
              if (
                filterType === FILTER_TYPE_REFERENCE_GRADE &&
                sensorType !== 'reference grade'
              ) {
                return <div key={index}></div>;
              }
              if (
                filterType === FILTER_TYPE_LOW_COST_SENSOR &&
                sensorType !== 'low-cost sensor'
              ) {
                return <div key={index}></div>;
              }
              return (
                <div key={sensorType}>
                  <div>
                    <strong>
                      {
                        nearbySensors.filter(
                          sensor => sensor.properties.sensorType === sensorType
                        ).length
                      }{' '}
                      {sensorType} sensors found{' '}
                      <a
                        onClick={() => {
                          toggleFilterType();
                          setTriggerCompareSearch(!triggerCompareSearch);
                        }}
                      >
                        [ change type ]
                      </a>
                    </strong>
                  </div>
                  <div>
                    Sort by: {sortType}{' '}
                    <a
                      onClick={() => {
                        toggleSortType();
                        setTriggerCompareSearch(!triggerCompareSearch);
                      }}
                    >
                      [ change sort type ]
                    </a>
                  </div>
                  <div>(Distance from Sensor #1)</div>
                  <div
                    onClick={() => {
                      setTriggerCompareSearch(!triggerCompareSearch);
                    }}
                  >
                    <a>[ Refresh list from map ]</a>
                  </div>
                  {nearbySensors.filter(
                    sensor => sensor.properties.sensorType === sensorType
                  ).length > 0 ? (
                    <div className="compare-sensors-list">
                      {nearbySensors
                        .filter(sensor => {
                          return sensor.properties.sensorType === sensorType;
                        })
                        .filter(sensor => {
                          // filter out sensors that are already being compared
                          let returnSensor = true;
                          compareLocations.forEach(loc => {
                            if (loc.data) {
                              if (sensor.properties.locationId === loc.data.id)
                                returnSensor = false;
                            }
                          });
                          return returnSensor;
                        })
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
                            className="compare-sensor"
                            onClick={() => {
                              setMenuState(0);
                              onCompareSpatialOptionsConfirm(
                                sensor.properties.locationId
                              );
                            }}
                            key={index}
                          >
                            <span>{sensor.distance.toFixed(2)} miles away</span>
                            , updated{' '}
                            {moment(sensor.properties.lastUpdated).fromNow()}.
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="compare-sensors-list">
                      <div className="compare-sensor">
                        No {sensorType}s were found within the map view. Try
                        moving the map or changing the parameter.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </li>
      )}
    </>
  );
}

CompareSpatialSensors.propTypes = {
  nearbySensors: T.array,
  compareLocations: T.array,
  triggerCompareSearch: T.bool,
  setTriggerCompareSearch: T.func,
  onOptSelect: T.func,
  onCompareSpatialOptionsConfirm: T.func,
  children: any,
};
