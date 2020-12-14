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
  order_by: [],
};

const sortOptions = ['name', 'count'];
const initFromLocation = ({ parameters, order_by }) => {
  return {
    parameters: parameters ? parameters.split(',') : [],
    order_by: order_by ? order_by.split(',') : [],
  };
};

export default function Filter({ parameters }) {
  let history = useHistory();
  let location = useLocation();

  const [selected, setSelected] = useState(
    initFromLocation(qs.parse(location.search, { ignoreQueryPrefix: true }))
  );

  parameters.sort((a, b) => a.name.localeCompare(b.name));
  const parameterIds = [...new Set(parameters.map(p => p.id))];

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

      case 'clear':
        query = null;
        setSelected(defaultSelected);
        break;
    }

    // update url
    history.push(`/projects?${buildQS(query)}`);
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
          triggerTitle="type__filter"
          triggerText="Pollutant"
        >
          <ul
            role="menu"
            data-cy="filter-parameters"
            className="drop__menu drop__menu--select scrollable"
          >
            {_.sortBy(parameterIds).map(id => {
              return (
                <li key={id}>
                  <div
                    data-cy="filter-menu-item"
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': selected.parameters.includes(
                        id
                      ),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => onFilterSelect('parameters', id)}
                  >
                    <span>{parameters.find(p => p.id === id).name}</span>
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

      {!(selected.parameters.length + selected.order_by.length === 0) && (
        <div className="filters-summary">
          {selected.parameters.map(o => {
            const parameter = parameters.find(x => x.id === o);
            return (
              <button
                type="button"
                className="button--filter-pill"
                data-cy="filter-pill"
                key={parameter.id}
                onClick={() => onFilterSelect('parameters', parameter.id)}
              >
                <span>{parameter.name}</span>
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
  sources: T.array,
  order_by: T.array,
};
