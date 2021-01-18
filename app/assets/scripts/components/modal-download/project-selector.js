'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import c from 'classnames';

export default function ProjectSelector(props) {
  const {
    countries,
    fetching,
    fetched,
    datasets,
    projCountry,
    projDataset,
    onOptSelect,
  } = props;

  const datasetLabel = fetching ? 'Loading Data' : 'Select a Dataset';

  // Disable datasets while they are not fetched.
  const disableDataset = !projCountry || !fetched || fetching;

  return (
    <fieldset className="form__fieldset form__fieldset--location">
      <legend className="form__legend">Location Selector</legend>
      <div className="form__group">
        <label htmlFor="project-country" className="form__label">
          Country
        </label>
        <select
          id="project-country"
          className="form__control form__control--medium select--base-bounded"
          value={projCountry}
          onChange={e => onOptSelect('projCountry', e)}
        >
          <option value="">Select a Country</option>
          {countries.map(o => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
      <div className={c('form__group', { disabled: disableDataset })}>
        <label htmlFor="proj-dataset" className="form__label">
          Dataset
        </label>
        <select
          id="proj-dataset"
          className="form__control form__control--medium select--base-bounded"
          value={projDataset}
          onChange={e => onOptSelect('projDataset', e)}
        >
          <option value="">{datasetLabel}</option>
          {datasets.map(o => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}

ProjectSelector.propTypes = {
  countries: T.array,
  fetching: T.bool,
  fetched: T.bool,
  datasets: T.array,
  projCountry: T.string,
  projDataset: T.string,
  onOptSelect: T.func,
};
