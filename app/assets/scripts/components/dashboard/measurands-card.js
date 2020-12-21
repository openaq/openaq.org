import React from 'react';
import { PropTypes as T } from 'prop-types';

import Card from '../card';
import Table from '../table';
import { shortenLargeNumber } from '../../utils/format';

const initData = {
  pollutant: {
    values: [],
    formatHeader: v => v.toUpperCase(),
    style: {
      color: 'black',
      fontWeight: 700,
      textAlign: 'left',
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

/*  TODO This function currently just extracts the first data available for each pollutant
 *  openAQ api returns all available dates averages, or those within a specified date range.
 *  The desired data in this card needs some clarification. should it be the most recent day?
 *  User specified day? date range? etc
 */

const prepareData = data => {
  const combinedData = data.reduce((accum, datum) => {
    const { parameter, count, average } = datum;
    if (!accum[parameter]) {
      accum[parameter] = {
        count: count,
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
          values: [...acc.avg.values, stats.value],
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

export default function MeasureandsCard({ parameters }) {
  return (
    <Card
      gridColumn={'1 / 5'}
      title="Parameters"
      renderBody={() => {
        return <Table data={prepareData(parameters)} />;
      }}
      noBodyStyle
    />
  );
}

MeasureandsCard.propTypes = {
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
      count: T.number.isRequired,
      average: T.number.isRequired,
    })
  ),
};
