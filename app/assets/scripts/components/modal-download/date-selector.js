'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import * as d3 from 'd3';

export default function DateSelector(props) {
  const { type, onOptSelect, dateState } = props;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = d3.range(1, 32, 1);
  const years = d3.range(2015, new Date().getFullYear() + 1, 1);

  return (
    <fieldset className="form__fieldset form__fieldset--date">
      <legend className="form__legend">
        {type === 'start' ? 'Start' : 'End'} Date
      </legend>
      <div className="form__group">
        <label htmlFor={`${type}-year`} className="form__label">
          Year
        </label>
        <select
          id={`${type}-year`}
          className="form__control form__control--medium select--base-bounded"
          value={dateState[`${type}Year`]}
          onChange={e => onOptSelect(`${type}Year`, e)}
        >
          <option value="">Year</option>
          {years.map(o => (
            <option key={`startyear-${o}`} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="form__group">
        <label htmlFor={`${type}-month`} className="form__label">
          Month
        </label>
        <select
          id={`${type}-month`}
          className="form__control form__control--medium select--base-bounded"
          value={dateState[`${type}Month`]}
          onChange={e => onOptSelect(`${type}Month`, e)}
        >
          <option value="">Month</option>
          {months.map((o, i) => (
            <option key={o} value={i}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="form__group">
        <label htmlFor={`${type}-day`} className="form__label">
          Day
        </label>
        <select
          id={`${type}-day`}
          className="form__control form__control--medium select--base-bounded"
          value={dateState[`${type}Day`]}
          onChange={e => onOptSelect(`${type}Day`, e)}
        >
          <option value="">Day</option>
          {days.map(o => (
            <option key={`startday-${o}`} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}

DateSelector.propTypes = {
  type: T.string,
  onOptSelect: T.func,
  dateState: T.object,
};
