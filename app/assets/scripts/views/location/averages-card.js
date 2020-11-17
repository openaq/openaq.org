import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import Card from '../../components/card';
import Table from '../../components/table';
import { shortenLargeNumber } from '../../utils/format';

const initData = {
  pollutant: {
    values: [],
    formatHeader: v => v.toUpperCase(),
    style: {
      color: 'black',
      fontWeight: 700,
    },
  },
  avg: {
    values: [],
    formatHeader: v => v.toUpperCase(),
    formatCell: shortenLargeNumber,
    style: {
      textAlign: 'center',
    },
  },
  count: {
    values: [],
    formatHeader: v => v.toUpperCase(),
    formatCell: shortenLargeNumber,
    style: {
      textAlign: 'center',
    },
  },
};

const StyledLoading = styled(LoadingMessage)`
  grid-column: 1 / 7;
`;
const ErrorMessage = styled.div`
  grid-column: 1 / 7;
`;

// TODO This function currently just extracts the first data available for each pollutant
const prepareData = data => {
  const combinedData = data.reduce((accum, datum) => {
    const { parameter, measurement_count, average } = datum;
    if (!accum[parameter]) {
      accum[parameter] = {
        count: measurement_count,
        value: average,
      };
    }
    return accum;
  }, {});

  const preparedData = Object.entries(combinedData).reduce(
    (acc, [pollutant, stats]) => {
      acc = {
        pollutant: {
          ...acc.pollutant,
          values: [...acc.pollutant.values, pollutant],
        },
        avg: {
          ...acc.avg,
          values: [...acc.count.values, stats.value],
        },
        count: {
          ...acc.count,
          values: [...acc.count.values, stats.count],
        },
      };
      return acc;
    },
    initData
  );
  return preparedData;
};
export default function Averages({ measurements }) {
  const { fetched, fetching, error, data } = measurements;

  if (!fetched && !fetching) {
    return null;
  } else if (fetching) {
    return <StyledLoading />;
  } else if (error) {
    return (
      <ErrorMessage className="fold__introduction prose prose--responsive">
        <p>{"We couldn't get stats. Please try again later."}</p>
        <p>
          {"If you think there's a problem, please "}
          <a href="mailto:info@openaq.org" title="Contact openaq">
            contact us.
          </a>
        </p>
      </ErrorMessage>
    );
  }

  return (
    <Card
      gridColumn={'1 / 7'}
      title="Measurands"
      renderBody={() => {
        return <Table data={prepareData(data.results)} />;
      }}
      renderFooter={() => null}
    />
  );
}
Averages.propTypes = {
  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
