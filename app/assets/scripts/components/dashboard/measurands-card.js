import React from 'react';
import { PropTypes as T } from 'prop-types';

import Card from '../card';
import Table from '../table';
import { shortenLargeNumber } from '../../utils/format';

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
      return `${shortenLargeNumber(value)} (${row.unit})`;
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

/*  TODO This function currently just extracts the first data available for each pollutant
 *  openAQ api returns all available dates averages, or those within a specified date range.
 *  The desired data in this card needs some clarification. should it be the most recent day?
 *  User specified day? date range? etc
 */

export default function MeasureandsCard({ parameters, titleInfo }) {
  const rows = parameters.map(p => ({
    parameter: p.displayName,
    avg: p.average,
    count: p.count,
    unit: p.unit,
  }));

  return (
    <Card
      gridColumn={'1 / -1'}
      title="Parameters"
      renderBody={() => {
        return <Table headers={tableHeaders} rows={rows} />;
      }}
      titleInfo={titleInfo}
    />
  );
}

MeasureandsCard.propTypes = {
  titleInfo: T.string,
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
      count: T.number.isRequired,
      average: T.number.isRequired,
    })
  ),
};
