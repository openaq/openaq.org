import React from 'react';
import { PropTypes as T } from 'prop-types';

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

export default function ParametersCard({ parameters, titleInfo }) {
  const rows = parameters.map(p => ({
    parameter: p.displayName,
    avg: p.average,
    count: p.count,
    unit: p.unit,
  }));

  return (
    <Card
      id="parameter"
      className="card--parameter"
      title="Parameters"
      renderBody={() => {
        return <Table headers={tableHeaders} rows={rows} />;
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
