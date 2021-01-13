import React, { useState, useEffect } from 'react';
import { Dropdown } from 'openaq-design-system';
import moment from 'moment';
import c from 'classnames';
import T from 'prop-types';
import DayPicker from 'react-day-picker';

/* Date selection component
 * @param dateRange {string} date in format YYYY/MM/DD (day is otional)
 * @param setDateRange {func} updater function
 */
function DateSelector(props) {
  const { dateRange, setDateRange } = props;

  const monthRange = moment.months();
  const curYear = new Date().getFullYear();
  const yearRange = new Array(props.maxYears || 25)
    .fill(0)
    .map((e, i) => curYear - i);
  const [dateMode, setDateMode] = useState(dateRange && true);

  const [initYear, initMonth, initDay] = (dateRange || '').split('/');

  const [year, setYear] = useState(initYear || curYear);
  const [month, setMonth] = useState(initMonth || 1);
  const [day, setDay] = useState(initDay || null);

  useEffect(() => {
    if (dateMode) {
      let date = `${year}/${month}`;
      if (day) {
        date = `${date}/${day}`;
      }
      setDateRange(date);
    } else {
      setDateRange(null);
    }
  }, [dateMode, year, month, day]);

  return (
    <div className="date-selector-filters">
      <Dropdown
        triggerElement="a"
        triggerTitle="Select time window"
        triggerText={
          dateMode ? 'Specific time window' : 'Entire lifetime of project'
        }
        triggerClassName="button--drop-filter filter--drop filter--time-window"
      >
        <ul role="menu" className="drop__menu drop__menu--select">
          <li>
            <div
              className={c('drop__menu-item', {
                'drop__menu-item--active': dateMode,
              })}
              data-hook="dropdown:close"
              onClick={() => setDateMode(true)}
            >
              <span>Specific time window</span>
            </div>
          </li>
          <li>
            <div
              className={c('drop__menu-item', {
                'drop__menu-item--active': !dateMode,
              })}
              data-hook="dropdown:close"
              onClick={() => setDateMode(false)}
            >
              <span>Entire lifetime of project</span>
            </div>
          </li>
        </ul>
      </Dropdown>

      {dateMode && (
        <>
          <Dropdown
            triggerElement="a"
            triggerTitle="date__year"
            triggerText={year}
            triggerClassName="button--drop-filter filter--drop"
          >
            <ul
              role="menu"
              className="drop__menu drop__menu--select scrollable"
            >
              {yearRange.map((y, i) => (
                <li key={`year-${i}`}>
                  <div
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': y === Number(year),
                    })}
                    data-hook="dropdown:close"
                    onClick={() => setYear(Number(y))}
                  >
                    <span>{y}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Dropdown>

          <Dropdown
            triggerElement="a"
            triggerTitle="date__month"
            triggerText={monthRange[month - 1]}
            triggerClassName="button--drop-filter filter--drop"
          >
            <ul
              role="menu"
              className="drop__menu drop__menu--select scrollable"
            >
              {monthRange.map((e, i) => (
                <li key={`month-${e}`}>
                  <div
                    className={c('drop__menu-item', {
                      'drop__menu-item--active': i === month - 1,
                    })}
                    data-hook="dropdown:close"
                    onClick={() => setMonth(i + 1)}
                  >
                    <span>{e}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Dropdown>

          <Dropdown
            triggerElement="a"
            triggerTitle="date__day"
            triggerText={day ? day : 'Entire month'}
            triggerClassName="button--drop-filter filter--drop"
          >
            <ul role="menu" className="drop__menu drop__menu--select ">
              <li>
                <div
                  className={c('drop__menu-item', {
                    'drop__menu-item--active': !day,
                  })}
                  data-hook="dropdown:close"
                  onClick={() => setDay(null)}
                >
                  <span>Entire Month</span>
                </div>
              </li>

              <li>
                <Dropdown
                  triggerElement="a"
                  triggerTitle="date__day"
                  triggerText={'Specific day'}
                  triggerClassName={c('drop__toggle-day drop__menu-item', {
                    'drop__menu-item--active': day && true,
                  })}
                  className="drop__content-day"
                  alignment="center"
                >
                  <DayPicker
                    month={new Date(year, Number(month) - 1)}
                    onDayClick={day => setDay(day.getDate())}
                    canChangeMonth={false}
                  />
                </Dropdown>
              </li>
            </ul>
          </Dropdown>
        </>
      )}
    </div>
  );
}

DateSelector.propTypes = {
  dateRange: T.string,
  setDateRange: T.string,
  maxYears: T.number,
};
export default DateSelector;
