import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import qs from 'qs';
import datefns from 'date-fns';

import config from '../../config';
import LoadingMessage from '../loading-message';
import ErrorMessage from '../error-message';
import Card from '../card';
import Table from '../table';
import { shortenLargeNumber, round } from '../../utils/format';

const tableHeaders = [
  {
    id: 'parameter',
    value: 'Parameter',
    sortable: true,
  },
  {
    id: 'avg',
    value: 'Average',
    sortable: true,
    formatCell: (value, row) => {
      return `${round(value, value < 2 ? 2 : 0)} (${row.unit})`;
    },
  },
  {
    id: 'count',
    value: 'Count',
    sortable: true,
    formatCell: value => {
      return shortenLargeNumber(value);
    },
  },
];

export default function ParametersCard({
  parameters,
  locationId,
  dateRange,
  titleInfo,
}) {
  const defaultState = {
    fetched: false,
    fetching: false,
    error: null,
    data: parameters,
  };
  // eslint-disable-next-line no-unused-vars
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  // eslint-disable-next-line no-unused-vars
  const [year, month, day] = (dateRange ? dateRange.split('/') : []).map(
    Number
  );

  // If lifetime, use day. Else hour
  const temporal = day ? 'day' : 'month';

  useEffect(() => {
    if (dateRange) fetchData(); // else use summary data provided by location itself

    return () => {
      setState(defaultState);
    };
  }, [dateRange]);

  const fetchData = () => {
    setState(state => ({ ...state, fetching: true, error: null }));

    const formatDate = (dateStr, dateFunc) => {
      let d = datefns.format(dateFunc(dateStr), 'YYYY-MM-DDTHH:mm:ss.SSS');
      /* The browser will treat dates as if they are in the users local time zone.
       * The backend expects time zone to be UTC
       * to compensate, treat the date as if it is already UTC. AKA we are NOT converting to UTC, just treating the date as such.
       * */

      d = `${d}Z`;
      return d;
    };

    let query = {
      location: locationId,
      spatial: 'location',
      temporal,
      limit: 1000,
      ...(dateRange
        ? {
            date_from: day
              ? formatDate(dateRange, datefns.startOfDay)
              : formatDate(dateRange, datefns.startOfMonth),
            date_to: day
              ? formatDate(dateRange, datefns.endOfDay)
              : formatDate(dateRange, datefns.endOfMonth),
          }
        : null),
    };

    fetch(`${config.api}/averages?${qs.stringify(query, { skipNulls: true })}`)
      .then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response');
        }
        return response.json();
      })
      .then(
        json => {
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            data: json.results,
          }));
        },
        e => {
          console.log('e', e);
          setState(state => ({
            ...state,
            fetched: true,
            fetching: false,
            error: e,
          }));
        }
      );
  };

  return (
    <Card
      id="parameter"
      className="card--parameter"
      title="Parameters"
      renderBody={() => {
        if (fetching) return <LoadingMessage />;
        if (data && data.length) {
          const rows = data.map(p => ({
            parameter: p.displayName,
            avg: p.average,
            count: p.measurement_count || p.count,
            unit: p.unit,
          }));
          return <Table headers={tableHeaders} rows={rows} />;
        }
        return <ErrorMessage instructions="Please try a different time" />;
      }}
      titleInfo={titleInfo}
    />
  );
}

ParametersCard.propTypes = {
  titleInfo: T.string,
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
      count: T.number.isRequired,
      average: T.number.isRequired,
    })
  ),
};
