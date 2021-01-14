import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import T from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const StyledTooltip = styled(ReactTooltip)`
  width: ${({ width }) => width || 'auto'};
  max-width: 20rem;
  /* Z index set to 10000 to go over tether-element
   * which has z-index 9999 */
`;

const Portal = ({ children }) => {
  const mount = document.getElementsByTagName('BODY')[0];
  const el = document.createElement('div');

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

/*
 * Select parameters from a list using checkboxes,
 * assumes Core and Additional as categories
 */
function ParamSelect(props) {
  const { parameters, onFilterSelect, selected } = props;
  const categories = [
    {
      id: 'Core',
      parameters: [],
      info: 'Core parameters are widely available across the OpenAQ platform.',
    },
    {
      id: 'Additional',
      info:
        'Additional parameters are less common than the core parameters. You may have to broaden other search filters when using these parameters to find sufficient results.',
      parameters: [],
    },
  ];

  return (
    <ul
      role="menu"
      data-cy="filter-parameters"
      className="drop__menu drop__menu--select scrollable padded"
    >
      {_.chain(parameters)
        .uniqBy('id')
        .reduce(([core, additional], param) => {
          if (param.isCore) {
            core.parameters.push(param);
          } else {
            additional.parameters.push(param);
          }
          return [core, additional];
        }, categories)
        .map(({ id, info, parameters: list }) => {
          return (
            <React.Fragment key={id}>
              <p
                className="drop__menu-section-title"
                data-tip
                data-for={`${id}-info`}
              >
                {id}
              </p>

              {info && (
                <Portal>
                  <StyledTooltip
                    className="filter-tooltip"
                    id={`${id}-info`}
                    effect="float"
                  >
                    {info}
                  </StyledTooltip>
                </Portal>
              )}

              {_.sortBy(list, 'displayName').map(param => {
                return (
                  <label
                    className="form__option form__option--custom-checkbox"
                    htmlFor={param.id}
                    key={param.id}
                    data-cy="filter-menu-item"
                    data-hook="dropdown:close"
                  >
                    <input
                      type="checkbox"
                      value={param.displayName}
                      id={param.id}
                      name="form-checkbox"
                      onChange={() => {
                        onFilterSelect('parameters', param.id);
                      }}
                      data-cy={param.id}
                      checked={selected.parameters.includes(param.id)}
                    />
                    <span className="form__option__text">
                      {param.displayName}
                    </span>
                    <span className="form__option__ui"></span>
                  </label>
                );
              })}
            </React.Fragment>
          );
        })
        .value()}
    </ul>
  );
}
ParamSelect.propTypes = {
  parameters: T.array,
  onFilterSelect: T.func,
  selected: T.object,
};
export default ParamSelect;
