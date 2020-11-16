import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import Card, { HighlightText, CardSubtitle } from '../../components/card';
import Table from '../../components/table';
const TEST_DATA = {
  pollutant: {
    values: [1, 2, 3],
    formatHeader: v => v.toUpperCase(),
    bold: true
  },
  avg: {
    values: [3, 2, 1],
    formatHeader: v => v.toUpperCase(),
    center: true,
  },
};

export default function Averages(props) {
  return (
    <Card
      gridColumn={'1 / 7'}
      title="Measurands"
      renderBody={() => {
        return (
          <Table data={TEST_DATA} />
        );
      }}
      renderFooter={() => null}
    />
  );
}
