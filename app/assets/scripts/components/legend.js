import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'openaq-design-system';
import c from 'classnames';

import { generateLegendStops } from '../utils/colors';

export default function Legend({ parameters, activeParameter, history }) {
  function onFilterSelect(parameter, e) {
    e.preventDefault();
    history.push(`map?parameter=${parameter}`);
  }

  let drop = (
    <Dropdown
      triggerElement="button"
      triggerClassName="button button--primary-unbounded drop__toggle--caret"
      triggerTitle="Show/hide parameter options"
      triggerText={activeParameter.name}
    >
      <ul role="menu" className="drop__menu drop__menu--select">
        {parameters.map((o, i) => (
          <li key={`${o.id}-${i}`}>
            <a
              className={c('drop__menu-item', {
                'drop__menu-item--active': activeParameter.id === o.id,
              })}
              href="#"
              title={`Show values for ${o.name}`}
              data-hook="dropdown:close"
              onClick={onFilterSelect.bind(null, o.id)}
            >
              <span>{o.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  );

  const scaleStops = generateLegendStops(activeParameter.id);
  const colorWidth = 100 / scaleStops.length;

  return (
    <div className="map__legend">
      <div>
        <p>Showing the most recent values for {drop}</p>
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
  parameters: PropTypes.array,
  activeParameter: PropTypes.object,
  history: PropTypes.object,
};
