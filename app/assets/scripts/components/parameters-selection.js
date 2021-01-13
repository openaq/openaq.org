import React from 'react';
import T from 'prop-types';
import _ from 'lodash';
// import ReactTooltip from 'react-tooltip';

const categories = [
  {
    id: 'Core',
    parameters: [],
  },
  {
    id: 'Additional',
    info:
      'The following pollutants are less common than the core parameters. You may have to broaden other search filters when using these parameters to find sufficient results',
    parameters: [],
  },
];

/*
 * Select parameters from a list using checkboxes,
 * assumes Core and Additional as categories
 */
function ParamSelect(props) {
  const { parameters, onFilterSelect, selected } = props;
  return (
    <ul
      role="menu"
      data-cy="filter-parameters"
      className="drop__menu drop__menu--select scrollable padded"
    >
      {_.chain(parameters)
        .uniq('id')
        .reduce(([core, additional], param) => {
          if (param.isCore) {
            core.parameters.push(param);
          } else {
            additional.parameters.push(param);
          }
          return [core, additional];
        }, categories)
        .map(({ id, /* info,*/ parameters: list }) => {
          return (
            <React.Fragment key={id}>
              <p
                className="drop__menu-section-title"
                data-tip
                data-for={`${id}-info`}
              >
                {id}
              </p>

              {/*info && (
                <ReactTooltip id={`${id}-info`} place="bottom" effect="float">
                  {info}
                </ReactTooltip>
              )*/}

              {_.sortBy(list).map(param => {
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
