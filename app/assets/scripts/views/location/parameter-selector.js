import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Dropdown } from 'openaq-design-system';
import c from 'classnames';

export default function ParameterSelector ({parameters, activeParam, onFilterSelect}) {
  const handleSelect = (e, id) => {
    e.preventDefault();

    onFilterSelect(id);
  };
  let drop = (
    <Dropdown
      triggerElement='button'
      triggerClassName='button button--base-unbounded drop__toggle--caret'
      triggerTitle='Show/hide parameter options'
      triggerText={activeParam.name} >

      <ul role='menu' className='drop__menu drop__menu--select'>
      {parameters.map(o => (
        <li key={o.id}>
          <a className={c('drop__menu-item', {'drop__menu-item--active': activeParam.id === o.id})} href='#' title={`Show values for ${o.name}`} data-hook='dropdown:close' onClick={(e) => handleSelect(e, o.id)}><span>{o.name}</span></a>
        </li>
      ))}
      </ul>
    </Dropdown>
  );

  return (
    <p>Showing {drop} values over last week.</p>
  );
}

ParameterSelector.propTypes = {
  parameters: T.array,
  activeParam: T.object,
  onFilterSelect: T.func
};
