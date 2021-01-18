import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function Parameters(props) {
  const { title, list, selected, onSelect } = props;

  return (
    <fieldset className="form__fieldset form__fieldset--parameters">
      <legend className="form__legend">{title}</legend>
      <div className="form__option-group">
        {list.map(o => {
          const checked = selected.indexOf(o.id) !== -1;
          const onChange = onSelect.bind(null, o.id);
          return (
            <label
              className="form__option form__option--custom-checkbox"
              htmlFor={o.id}
              key={o.id}
            >
              <input
                type="checkbox"
                value={o.id}
                id={o.id}
                name="download-parameters"
                onChange={onChange}
                checked={checked}
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

Parameters.propTypes = {
  title: T.string,
  list: T.array,
  selected: T.array,
  onSelect: T.func,
};
