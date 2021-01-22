import React from 'react';
import c from 'classnames';
import { PropTypes as T } from 'prop-types';
import InfoButton from '../info-button';

export default function Options(props) {
  const { title, name, info, list, selected, onSelect, disabled } = props;

  return (
    <fieldset className="form__fieldset form__fieldset--parameters">
      <div className="form__inner-header">
        <div className="form__inner-headline">
          <legend className="form__legend">{title}</legend>
        </div>
        {info && (
          <div className="form__inner-toolbar">
            <InfoButton id={name} info={info} />
          </div>
        )}
      </div>

      <div className="form__option-group">
        {list.map(o => {
          const checked = selected.indexOf(o.id) !== -1;
          const onChange = onSelect.bind(null, o.id);
          return (
            <label
              className={c('form__option form__option--custom-checkbox', {
                disabled,
              })}
              htmlFor={o.id}
              key={o.id}
            >
              <input
                type="checkbox"
                value={o.id}
                id={o.id}
                name={name}
                onChange={onChange}
                checked={checked}
                disabled={disabled}
              />
              <span className="form__option__text">{o.displayName}</span>
              <span className="form__option__ui"></span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

Options.propTypes = {
  title: T.string,
  name: T.string,
  info: T.string,
  list: T.array,
  selected: T.array,
  onSelect: T.func,
  disabled: T.bool,
};
