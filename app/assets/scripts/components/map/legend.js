import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'openaq-design-system';
import c from 'classnames';

import { generateLegendStops } from '../../utils/colors';

export default function Legend({
  parameters,
  activeParameter,
  onParamSelection,
}) {
  function onFilterSelect(parameter, e) {
    e.preventDefault();
    onParamSelection(parameter);
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
          <li key={`${param.parameterId || param.id}`}>
            <a
              className={c('drop__menu-item', {
                'drop__menu-item--active': activeParameter.id === param.id,
              })}
              href="#"
              title={`Show values for ${param.displayName}`}
              data-hook="dropdown:close"
              onClick={e => onFilterSelect(param.parameterId || param.id, e)}
            >
              <span>{param.displayName}</span>
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  );

  const scaleStops = generateLegendStops(
    activeParameter.parameterId || activeParameter.id
  );
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
    name: PropTypes.string,
    id: PropTypes.number,
    parameterId: PropTypes.number.isRequired,
  }).isRequired,
  onParamSelection: PropTypes.func,
};
