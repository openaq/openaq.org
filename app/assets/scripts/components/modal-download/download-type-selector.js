import React from 'react';
import { PropTypes as T } from 'prop-types';

const downloadTypes = [
  {
    id: 'locations',
    label: 'Locations',
  },
  {
    id: 'projects',
    label: 'Datasets',
  },
];

export const downloadTypeDefault = downloadTypes[0].id;

export default function DownloadType(props) {
  const { selected, onSelect } = props;

  return (
    <fieldset className="form__fieldset form__fieldset--parameters">
      <legend className="form__legend">Data download</legend>
      <div className="form__option-group">
        {downloadTypes.map(o => {
          return (
            <label
              className="form__option form__option--custom-radio"
              htmlFor={o.id}
              key={o.id}
            >
              <input
                type="radio"
                value={o.id}
                id={o.id}
                name="download-data-type"
                onChange={() => onSelect(o.id)}
                checked={selected === o.id}
              />
              <span className="form__option__text">{o.label}</span>
              <span className="form__option__ui"></span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

DownloadType.propTypes = {
  title: T.string,
  list: T.array,
  selected: T.array,
  onSelect: T.func,
};
