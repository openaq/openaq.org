import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import c from 'classnames';
import _ from 'lodash';
import { Dropdown } from 'openaq-design-system';

import { buildQS } from '../../utils/url';
import { toggleValue } from '../../utils/array';

const defaultSelected = {
  parameters: [],
  countries: [],
  sources: [],
  order_by: [],
  source_type: [],
};

const sortOptions = ['location', 'country', 'city', 'count'];
const sourceTypeOptions = ['stationary', 'mobile'];

const initFromLocation = ({
  countries,
  parameters,
  sources,
  order_by,
  source_type,
}) => {
  return {
    parameters: parameters ? parameters.split(',') : [],
    countries: countries ? countries.split(',') : [],
    sources: sources ? sources.split(',') : [],
    order_by: order_by ? order_by.split(',') : [],
    source_type: source_type ? source_type.split(',') : [],
  };
};
export default function Filter({ countries, parameters, sources }) {
  let history = useHistory();
  let location = useLocation();

  const [selected, setSelected] = useState(
    initFromLocation(qs.parse(location.search, { ignoreQueryPrefix: true }))
  );

  // alphabetizes filter names
  const sortList = list => list.sort((a, b) => a.name.localeCompare(b.name));
  sortList(countries);
  sortList(parameters);

  const parameterNames = [...new Set(parameters.map(p => p.name))];

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
        if (query.source_type && query.source_type.includes(value)) {
          query.source_type = [];
          setSelected(prev => ({
            ...prev,
            ['source_type']: [],
          }));
        } else {
          query.source_type = [value];
          setSelected(prev => ({
            ...prev,
            ['source_type']: [value],
          }));
        }
        break;
      }

      case 'parameters': {
        const parameters =
          query && query.parameters ? query.parameters.split(',') : [];
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
    history.push(`/locations?${buildQS(query)}`);
  }

  return (
    <>
      <div className="filters">
        <nav className="fold__nav">
          <h2>Filter by</h2>
          <h2>Order by</h2>
        </nav>

        <Dropdown
          triggerElement="a"
          triggerTitle="country__filter"
          triggerText="Country"
          triggerClassName="drop-trigger"
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

        <Dropdown
          triggerElement="a"
          triggerTitle="type__filter"
          triggerText="Parameter"
        >
          <ul
            role="menu"
            data-cy="filter-parameters"
            className="drop__menu drop__menu--select scrollable"
          >
            {/* references list of unique ids to avoid duplicate list items while allowing 
            selection of parameters with different units and shared id */}
            {_.sortBy(parameterNames).map(paramName => {
              return (
                <li key={paramName}>
                  <div
                    data-cy="filter-menu-item"
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': selected.parameters.includes(
                        paramName
                      ),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => onFilterSelect('parameters', paramName)}
                  >
                    <span data-cy={paramName}>{paramName}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Dropdown>

        <Dropdown
          triggerElement="a"
          triggerTitle="source__filter"
          triggerText="Data Source"
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
                    <span data-cy={o.sourceName}>{o.sourceName}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Dropdown>
        <Dropdown
          triggerElement="a"
          triggerTitle="source-type__filter"
          triggerText="Source Type"
          triggerClassName="drop-trigger"
        >
          <ul
            role="menu"
            data-cy="filter-source-type"
            className="drop__menu drop__menu--select scrollable"
          >
            {_.sortBy(sourceTypeOptions).map(o => {
              return (
                <li key={o}>
                  <div
                    data-cy="filter-menu-item"
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': selected.source_type.includes(
                        o
                      ),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => {
                      onFilterSelect('source_type', o);
                    }}
                  >
                    <span data-cy={o}>{o}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Dropdown>

        <Dropdown
          triggerElement="a"
          triggerTitle="sort__filter"
          triggerText="Order By"
          triggerClassName="sort-order"
        >
          <ul role="menu" className="drop__menu drop__menu--select scrollable">
            {_.sortBy(sortOptions).map(o => {
              return (
                <li key={o}>
                  <div
                    data-cy="filter-menu-item"
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': selected.order_by.includes(o),
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

      {Object.values(selected).find(o => o.length > 0) && (
        <div className="filters-summary">
          {selected.countries.map(o => {
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

          {selected.parameters.map(o => {
            const parameter = parameters.find(x => x.name === o);
            return (
              <button
                type="button"
                className="button--filter-pill"
                data-cy="filter-pill"
                key={parameter.name}
                onClick={() => onFilterSelect('parameters', parameter.name)}
              >
                <span>{parameter.name}</span>
              </button>
            );
          })}

          {selected.sources.map(o => {
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

          {selected.source_type.map(o => {
            return (
              <button
                type="button"
                className="button--filter-pill"
                key={o}
                onClick={() => onFilterSelect('source_type', o)}
              >
                <span>{o}</span>
              </button>
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
  organizations: T.array,
  parameters: T.array,
  countries: T.array,
  sources: T.array,
  order_by: T.array,
};
