import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Dropdown } from 'openaq-design-system';
import c from 'classnames';
import _ from 'lodash';

export default function Filter({
  organizations,
  parameters,
  sources,
  orderBy,
}) {
  let sortOptions = ['organization'];

  let queryOrganizations = [];
  let queryParameters = [];
  let querySources = [];
  let queryOrderBy = [];

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
          triggerText="Organization"
          triggerClassName="drop-trigger"
        >
          <ul role="menu" className="drop__menu drop__menu--select scrollable">
            {_.sortBy(organizations).map(o => {
              return (
                <li key={o.id}>
                  <div
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': queryOrganizations.includes(
                        o.id
                      ),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => {}}
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
          triggerTitle="type__filter"
          triggerText="Pollutant"
        >
          <ul role="menu" className="drop__menu drop__menu--select scrollable">
            {_.sortBy(parameters).map(o => {
              return (
                <li key={o.id}>
                  <div
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': queryParameters.includes(
                        o.code
                      ),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => {}}
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
          triggerTitle="source__filter"
          triggerText="Data Source"
        >
          <ul role="menu" className="drop__menu drop__menu--select scrollable">
            {_.sortBy(sources).map(o => {
              return (
                <li key={o.name}>
                  <div
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': querySources.includes(o.code),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => {}}
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
                      'drop__menu-item--active': queryOrderBy.includes(o),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => {}}
                  >
                    <span>{`${o[0].toUpperCase()}${o.slice(1)}`}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Dropdown>
      </div>

      {organizations &&
        !(
          organizations.length +
            parameters.length +
            sources.length +
            orderBy.length ===
          0
        ) && (
          <div className="filters-summary">
            {organizations.map(o => {
              return organizations.indexOf(o.code) !== -1 ? (
                <button
                  type="button"
                  className="button--filter-pill"
                  key={o.code}
                  onClick={() => {}}
                >
                  <span>{o.name}</span>
                </button>
              ) : null;
            })}
            {parameters.map(o => {
              return parameters.indexOf(o.id) !== -1 ? (
                <button
                  type="button"
                  className="button--filter-pill"
                  key={o.id}
                  onClick={() => {}}
                >
                  <span>{o.name}</span>
                </button>
              ) : null;
            })}
            {sources.map(o => {
              return sources.indexOf(o.name) !== -1 ? (
                <button
                  type="button"
                  className="button--filter-pill"
                  key={o.name}
                  onClick={() => {}}
                >
                  <span>{o.name}</span>
                </button>
              ) : null;
            })}
            {orderBy.map(o => {
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
  orderBy: T.array,
};
