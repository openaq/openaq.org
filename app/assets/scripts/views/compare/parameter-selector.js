import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';
import { Dropdown } from 'openaq-design-system';

export default function ParameterSelector(props) {
  const { activeParam, parameters, onSelect } = props;

  const drop = (
    <Dropdown
      triggerElement="button"
      triggerClassName="button button--base-unbounded drop__toggle--caret"
      triggerTitle="Show/hide parameter options"
      triggerText={activeParam.displayName}
    >
      <ul role="menu" className="drop__menu drop__menu--select scrollable">
        {parameters.map(o => (
          <li key={o.id}>
            <a
              className={c('drop__menu-item', {
                'drop__menu-item--active': activeParam.id === o.id,
              })}
              href="#"
              title={`Show values for ${o.displayName}`}
              data-hook="dropdown:close"
              onClick={e => {
                e.preventDefault();
                onSelect(o.id);
              }}
            >
              <span>{o.displayName}</span>
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  );

  return <p>Comparing {drop} values for local times</p>;
}

ParameterSelector.propTypes = {
  activeParam: T.object,
  parameters: T.array,
  onSelect: T.func,
};
