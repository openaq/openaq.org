import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { Dropdown } from 'openaq-design-system';
import c from 'classnames';

import { generateLegendStops } from '../../utils/colors';

export default function Legend({ parameters, activeParameter }) {
  let location = useLocation();
  let history = useHistory();

  function onFilterSelect(parameter, e) {
    e.preventDefault();
    history.push(`${location.pathname}?parameter=${parameter}`);
  }

  let drop = (
    <Dropdown
      triggerElement="button"
      triggerClassName="button button--primary-unbounded drop__toggle--caret"
      triggerTitle="Show/hide parameter options"
      triggerText={activeParameter.displayName}
    >
      <ul
        role="menu"
        className="drop__menu drop__menu--select"
        style={{ overflowY: `scroll`, maxHeight: `15rem` }}
      >
        {parameters.map(param => (
          <li key={`${param.id}`}>
            <a
              className={c('drop__menu-item', {
                'drop__menu-item--active': param.id === activeParameter.id,
              })}
              href="#"
              title={`Show values for ${param.displayName}`}
              data-hook="dropdown:close"
              onClick={e => onFilterSelect(param.id, e)}
            >
              <span>{param.displayName}</span>
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  );

  const scaleStops = generateLegendStops(activeParameter.name.toLowerCase());
  const colorWidth = 100 / scaleStops.length;

  return (
    <div className="map__legend">
      <div>
        <p>
          Showing the most recent values for{' '}
          {parameters.length > 1 ? drop : activeParameter.displayName}
        </p>
        <ul className="color-scale">
          {scaleStops.map(o => (
            <li
              key={o.label}
              style={{ backgroundColor: o.color, width: `${colorWidth}%` }}
              className="color-scale__item"
            >
              <span className="color-scale__value">{o.label}</span>
            </li>
          ))}
        </ul>
        <small className="disclaimer">
          <a href="https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85">
            Data Disclaimer and More Information
          </a>
        </small>
      </div>
    </div>
  );
}

Legend.propTypes = {
  parameters: PropTypes.array.isRequired,
  activeParameter: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
};
