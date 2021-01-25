import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import c from 'classnames';
import _ from 'lodash';
import { Dropdown } from 'openaq-design-system';

import { fetchBaseData as fetchBaseDataAction } from '../actions/action-creators';
import { buildQS } from '../utils/url';
import { toggleValue } from '../utils/array';
import ParamSelect from './parameters-selection';
import SensorTypeFilter from './sensor-type-filter';

const defaultSelected = {
  parameters: [],
  countries: [],
  sources: [],
  order_by: [],
  source_type: [],
};

const procLevelOptions = ['Analysis'];

const initFromLocation = ({
  countries,
  parameters,
  sources,
  order_by,
  grade,
  manufacturer,
  mobility,
  entity,
  procLevel,
}) => {
  return {
    parameters: parameters ? parameters.split(',').map(Number) : [],
    countries: countries ? countries.split(',') : [],
    sources: sources ? sources.split(',') : [],
    order_by: order_by ? order_by.split(',') : [],
    procLevel: procLevel,
    grade: grade,
    manufacturer: manufacturer,
    mobility: mobility,
    entity: entity,
  };
};
export default function Filter({
  slug,
  by,
  fetchBaseData,
  orderByOptions,
  countries,
  parameters,
  sources,
  manufacturers,
}) {
  let history = useHistory();
  let location = useLocation();

  const [selected, setSelected] = useState(
    initFromLocation(qs.parse(location.search, { ignoreQueryPrefix: true }))
  );

  useEffect(() => {
    fetchBaseData();
  }, []);

  // alphabetizes filter names
  const sortList = list => list.sort((a, b) => a.name.localeCompare(b.name));
  if (countries) sortList(countries);
  if (parameters) sortList(parameters);

  function onFilterSelect(what, value) {
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    switch (what) {
      case 'order_by': {
        if (query.order_by && query.order_by.includes(value)) {
          query.order_by = [];
          setSelected(prev => ({
            ...prev,
            ['order_by']: [],
          }));
        } else {
          query.order_by = [value];
          setSelected(prev => ({
            ...prev,
            ['order_by']: [value],
          }));
        }
        break;
      }

      case 'source_type': {
        const { grade, manufacturer, mobility, entity } = value;
        query.grade = grade;
        query.manufacturer = manufacturer;
        query.mobility = mobility;
        query.entity = entity;
        setSelected(prev => ({
          ...prev,
          grade: query.grade,
          manufacturer: query.manufacturer,
          mobility: query.mobility,
          entity: query.entity,
        }));
        break;
      }

      case 'procLevel': {
        query.procLevel = value;
        setSelected(prev => ({
          ...prev,
          procLevel: value,
        }));
        break;
      }

      case 'parameters': {
        // Parameters are tracked by id which is a Number so it needs to be cast
        const parameters =
          query && query.parameters
            ? query.parameters.split(',').map(Number)
            : [];
        query.parameters = toggleValue(parameters, value);

        setSelected(prev => ({
          ...prev,
          ['parameters']: toggleValue(prev['parameters'], value),
        }));
        break;
      }

      case 'countries': {
        const countries =
          query && query.countries ? query.countries.split(',') : [];

        query.countries = toggleValue(countries, value);

        setSelected(prev => ({
          ...prev,
          countries: toggleValue(prev['countries'], value),
        }));
        break;
      }
      case 'sources': {
        const sources = query && query.sources ? query.sources.split(',') : [];

        query.sources = toggleValue(sources, value);

        setSelected(prev => ({
          ...prev,
          ['sources']: toggleValue(prev['sources'], value),
        }));
        break;
      }

      case 'clear':
        query = null;
        setSelected(defaultSelected);
        break;
    }

    // update url
    history.push(`${slug}?${buildQS(query)}`);
  }

  return (
    <>
      <div className="hub-filters">
        <div className="inner">
          <div className="filters__group">
            <h2>Filter by</h2>
            <div className="filter__values">
              {countries && countries.length > 1 && by.includes('countries') && (
                <Dropdown
                  triggerElement="a"
                  triggerTitle="View country options"
                  triggerText="Country"
                  triggerClassName="button--drop-filter filter--drop"
                >
                  <ul
                    role="menu"
                    data-cy="filter-countries"
                    className="drop__menu drop__menu--select scrollable"
                  >
                    {_.sortBy(countries).map(o => {
                      return (
                        <li key={o.code}>
                          <div
                            data-cy="filter-menu-item"
                            className={c('drop__menu-item', {
                              'drop__menu-item--active': selected.countries.includes(
                                o.code
                              ),
                            })}
                            data-hook="dropdown:close"
                            onClick={() => {
                              onFilterSelect('countries', o.code);
                            }}
                          >
                            <span data-cy={o.name}>{o.name}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Dropdown>
              )}

              {parameters && parameters.length > 1 && by.includes('countries') && (
                <Dropdown
                  triggerElement="a"
                  triggerTitle="View parameter options"
                  triggerText="Parameter"
                  triggerClassName="button--drop-filter filter--drop"
                >
                  <ParamSelect
                    parameters={parameters}
                    onFilterSelect={onFilterSelect}
                    selected={selected}
                  />
                </Dropdown>
              )}

              {sources && sources.length > 1 && by.includes('sources') && (
                <Dropdown
                  triggerElement="a"
                  triggerTitle="View source options"
                  triggerText="Data Source"
                  triggerClassName="button--drop-filter"
                >
                  <ul
                    role="menu"
                    data-cy="filter-sources"
                    className="drop__menu drop__menu--select scrollable"
                  >
                    {_.sortBy(sources).map(o => {
                      return (
                        <li key={o.sourceSlug}>
                          <div
                            data-cy="filter-menu-item"
                            className={c('drop__menu-item', {
                              'drop__menu-item--active': selected.sources.includes(
                                o.sourceSlug
                              ),
                            })}
                            data-hook="dropdown:close"
                            onClick={() => {
                              onFilterSelect('sources', o.sourceSlug);
                            }}
                          >
                            <span data-cy={o.sourceSlug}>{o.sourceName}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Dropdown>
              )}
              {by.includes('processing-level') && (
                <Dropdown
                  triggerElement="a"
                  triggerTitle="View processing level options"
                  triggerText="Processing level"
                  triggerClassName="button--drop-filter"
                >
                  <ul
                    role="menu"
                    data-cy="filter-processing-level"
                    className="drop__menu drop__menu--select scrollable"
                  >
                    {_.sortBy(procLevelOptions).map(o => {
                      return (
                        <li key={o}>
                          <div
                            data-cy="filter-menu-item"
                            className={c('drop__menu-item', {
                              'drop__menu-item--active': selected.procLevel,
                            })}
                            data-hook="dropdown:close"
                            onClick={() => {
                              onFilterSelect('procLevel', o);
                            }}
                          >
                            <span data-cy={o}>{o}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Dropdown>
              )}

              {by.includes('sensor') && (
                <Dropdown
                  triggerElement="a"
                  triggerTitle="View sensor type options"
                  triggerText="Sensor Type"
                  triggerClassName="button--drop-filter"
                  className="sensor__type-filter"
                >
                  <SensorTypeFilter
                    onApplyClick={(grade, manufacturer, mobility, entity) => {
                      onFilterSelect('source_type', {
                        grade,
                        manufacturer,
                        mobility,
                        entity,
                      });
                    }}
                    grade={selected.grade}
                    mobility={selected.mobility}
                    entity={selected.entity}
                    manufacturers={manufacturers}
                  />
                </Dropdown>
              )}
            </div>
          </div>
          <div className="filters__group">
            <h2>Order by</h2>
            <div className="filter__values">
              <Dropdown
                triggerElement="a"
                triggerTitle="View sort options"
                triggerText="Order By"
                triggerClassName="button--drop-filter filter--drop sort-order"
              >
                <ul
                  role="menu"
                  className="drop__menu drop__menu--select scrollable"
                >
                  {_.sortBy(orderByOptions).map(o => {
                    return (
                      <li key={o}>
                        <div
                          data-cy="filter-menu-item"
                          className={c('drop__menu-item', {
                            'drop__menu-item--active': selected.order_by.includes(
                              o
                            ),
                          })}
                          data-hook="dropdown:close"
                          onClick={() => onFilterSelect('order_by', o)}
                        >
                          <span>{`${o[0].toUpperCase()}${o.slice(1)}`}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {Object.values(selected).find(o => {
        return Array.isArray(o) ? o.length > 0 : o;
      }) && (
        <div className="filters-summary">
          {!!countries?.length &&
            selected.countries.map(o => {
              const country = countries.find(x => x.code === o);
              return (
                <button
                  type="button"
                  className="button--filter-pill"
                  data-cy="filter-pill"
                  key={country.code}
                  onClick={() => onFilterSelect('countries', country.code)}
                >
                  <span>{country.name}</span>
                </button>
              );
            })}
          {!!parameters?.length &&
            selected.parameters.map(o => {
              const parameter = parameters.find(x => x.id === o);
              return (
                <button
                  type="button"
                  className="button--filter-pill"
                  data-cy="filter-pill"
                  key={parameter.id}
                  onClick={() => onFilterSelect('parameters', parameter.id)}
                >
                  <span>{parameter.displayName}</span>
                </button>
              );
            })}
          {selected.procLevel && (
            <button
              type="button"
              className="button--filter-pill"
              data-cy="filter-pill"
              key={selected.procLevel}
              onClick={() => onFilterSelect('procLevel', null)}
            >
              <span>{selected.procLevel}</span>
            </button>
          )}

          {sources &&
            !!sources?.length &&
            selected.sources.map(o => {
              const source = sources.find(x => x.sourceSlug === o);
              return (
                <button
                  type="button"
                  className="button--filter-pill"
                  data-cy="filter-pill"
                  key={source.sourceSlug}
                  onClick={() => onFilterSelect('sources', source.sourceSlug)}
                >
                  <span>{source.sourceName}</span>
                </button>
              );
            })}
          {['grade', 'manufacturer', 'mobility', 'entity'].map(key => {
            const o = selected[key];
            return (
              o && (
                <button
                  type="button"
                  className="button--filter-pill"
                  key={o}
                  onClick={() =>
                    onFilterSelect('source_type', {
                      grade: selected.grade,
                      mobility: selected.mobility,
                      entity: selected.entity,
                      manufacturer: selected.manufacturer,

                      [key]: null,
                    })
                  }
                >
                  <span>{o}</span>
                </button>
              )
            );
          })}
          {selected.order_by.map(o => {
            return (
              <button
                type="button"
                className="button--filter-pill orderBy"
                key={o}
                onClick={() => onFilterSelect('order_by', o)}
              >
                <span>{o}</span>
              </button>
            );
          })}
          <button
            type="button"
            className="button button--small button--primary-unbounded"
            title="Clear all selected filters"
            data-cy="filter-clear"
            onClick={e => {
              e.preventDefault();
              onFilterSelect('clear');
            }}
          >
            <small> (Clear Filters)</small>
          </button>
        </div>
      )}
    </>
  );
}

Filter.propTypes = {
  slug: PropTypes.string.isRequired,
  by: PropTypes.arrayOf(
    PropTypes.oneOf([
      'organizations',
      'parameters',
      'countries',
      'sources',
      'manufacturers',
    ])
  ),
  orderByOptions: PropTypes.array,

  fetchBaseData: PropTypes.func.isRequired,

  organizations: PropTypes.array,
  parameters: PropTypes.array,
  countries: PropTypes.array,
  sources: PropTypes.array,
  order_by: PropTypes.array,
  manufacturers: PropTypes.array,
};

// /////////////////////////////////////////////////////////////////////
// Connect functions

function selector(state) {
  return {
    parameters: state.baseData.data.parameters,
    countries: state.baseData.data.countries,
    sources: state.baseData.data.sources,
    manufacturers: state.baseData.data.manufacturers,
  };
}

function dispatcher(dispatch) {
  return {
    fetchBaseData: (...args) => dispatch(fetchBaseDataAction(...args)),
  };
}

module.exports = connect(selector, dispatcher)(Filter);
