import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import ErrorMessage from '../error-message';
import Card, {
  CardHeader as BaseHeader,
  CardTitle,
  CardHeadline,
} from '../card';
import TabbedSelector from '../tabbed-selector';
import LineChart from '../line-chart';
import InfoButton from '../info-button';

const ChartContainer = styled.div`
  max-height: 24rem;
  min-height: 20rem;
  padding: 0;
`;

const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

export default function TimeSeriesCard({ parameters, data, titleInfo }) {
  // eslint-disable-next-line no-unused-vars

  const [activeTab, setActiveTab] = useState({
    id: parameters[0].parameter || parameters[0],
    name: parameters[0].parameter || parameters[0],
  });

  const activeData = data[activeTab.id];

  return (
    <Card
      id="time-series"
      className="card--time-series"
      renderHeader={() => (
        <CardHeader className="card__header">
          <TabbedSelector
            tabs={parameters.map(x => ({
              id: x.parameter || x,
              name: x.displayName || x,
            }))}
            activeTab={activeTab}
            onTabSelect={t => {
              setActiveTab(t);
            }}
          />
          <CardHeadline>
            <CardTitle className="card__title">Time Series Data</CardTitle>
            {titleInfo && <InfoButton info={titleInfo} id="time-series-info" />}
          </CardHeadline>
        </CardHeader>
      )}
      renderBody={() => (
        <ChartContainer className="card__body">
          {activeData && activeData.length ? (
            <LineChart
              data={activeData.map(m => ({
                x: new Date(m['day']),
                y: m.average,
              }))}
              yLabel={activeData && activeData[0].displayName}
              yUnit={activeData && activeData[0].unit}
            />
          ) : (
            <ErrorMessage instructions="Please try a different time" />
          )}
        </ChartContainer>
      )}
    />
  );
}

TimeSeriesCard.propTypes = {
  titleInfo: T.string,
  data: T.object,
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
    })
  ),
};
