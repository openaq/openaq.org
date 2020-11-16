import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import Card, { HighlightText, CardSubtitle } from '../../components/card';
import Table from '../../components/table';
import { shortenLargeNumber } from '../../utils/format';
const TEST_DATA = {
  pollutant: {
    values: [1, 2, 3],
    formatHeader: v => v.toUpperCase(),
    style: {
      color: 'black',
      'font-weight': 700
    },
  },
  avg: {
    values: [3, 2, 1],
    formatHeader: v => v.toUpperCase(),
    formatCell: shortenLargeNumber,
    style: {
      'text-align': 'center',
    },
  },
};

export default function Averages(props) {
  return (
    <Card
      gridColumn={'1 / 7'}
      title="Measurands"
      renderBody={() => {
        return <Table data={TEST_DATA} />;
      }}
      renderFooter={() => null}
    />
  );
}
