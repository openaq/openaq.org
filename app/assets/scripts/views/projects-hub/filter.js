import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import c from 'classnames';
import _ from 'lodash';
import { Dropdown } from 'openaq-design-system';

import { buildQS } from '../../utils/url';
import { toggleValue } from '../../utils/array';

export default function Filter({ parameters }) {
  let history = useHistory();
  let location = useLocation();

  let sortOptions = ['count'];

  const [selected, setSelected] = useState({
    parameters: [],
    order_by: [],
  });

  function onFilterSelect(what, value) {
    setSelected(prev => ({ ...prev, [what]: toggleValue(prev[what], value) }));

    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });

    switch (what) {
      case 'order_by': {
        const order_by =
          query && query.order_by ? query.order_by.split(',') : [];
        query.order_by = toggleValue(order_by, value);
        !query.order_by.length && delete query.order_by;
        break;
      }

      case 'parameters': {
        const parameters =
          query && query.parameters ? query.parameters.split(',') : [];
        query.parameters = toggleValue(parameters, value);
        !query.parameters.length && delete query.parameters;
        break;
      }

      case 'clear':
        delete query.countries;
        delete query.parameters;
        delete query.sources;
        delete query.order_by;
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
          <ul role="menu" className="drop__menu drop__menu--select scrollable">
            {_.sortBy(parameters).map(o => {
              return (
                <li key={o.id}>
                  <div
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': selected.parameters.includes(
                        o.id
                      ),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => onFilterSelect('parameters', o.id)}
                  >
                    <span>{o.name}</span>
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
                key={parameter.id}
                onClick={() => {}}
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
                onClick={() => {}}
              >
                <span>{o}</span>
              </button>
            );
          })}

          <button
            type="button"
            className="button button--small button--primary-unbounded"
            title="Clear all selected filters"
            onClick={e => {
              e.preventDefault();
              this.onFilterSelect('clear');
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
