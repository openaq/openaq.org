import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import MeasurementsChart from './measurements-chart';
import Card, {
  CardHeader as BaseHeader,
  CardSubtitle,
  CardTitle,
} from '../../components/card';
import DatePicker from 'react-datepicker';

import TabbedSelector from '../../components/tabbed-selector';

const ErrorMessage = styled.div`
  grid-column: 1 / -1;
`;
const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr 1fr;
  grid-gap: 0.5rem;
`;
const DateSelector = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 50%;
  > p {
    margin-right: 2rem;
    margin-bottom: 0;
  }
`;

export default function ValuesBreakdown({ measurements, parameters }) {
  const { fetched, fetching, error } = measurements;
  const [activeTab, setActiveTab] = useState(parameters[0]);
  const [dateRange, setDateRange] = useState({
    end: new Date(),
    start: new Date('1/1/2020'),
  });

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingMessage />;
  } else if (error) {
    return (
      <ErrorMessage>
        <p>We couldn&apos;t get any data.</p>
        <InfoMessage>
          <p>Please try again later.</p>
          <p>
            If you think there&apos;s a problem, please{' '}
            <a href="mailto:info@openaq.org" title="Contact openaq">
              contact us.
            </a>
          </p>
        </InfoMessage>
      </ErrorMessage>
    );
  }
  return (
    <Card
      gridColumn={'1  / -1'}
      renderHeader={() => (
        <CardHeader className="card__header">
          <TabbedSelector
            tabs={parameters}
            activeTab={activeTab}
            onTabSelect={t => {
              setActiveTab(t);
            }}
          />

          <DateSelector>
            <CardSubtitle className="card__subtitle">Period</CardSubtitle>

            <DatePicker
              selected={dateRange.start}
              onChange={([start, end]) => {
                setDateRange({ start, end });
              }}
              startDate={dateRange.start}
              endDate={dateRange.end}
              shouldCloseOnSelect
              selectsRange
              customInput={
                <a>
                  {`${dateRange.start.toDateString()} - ${dateRange.end && dateRange.end.toDateString()}`}
                </a>
              }
            />
          </DateSelector>

          <CardTitle>Time Series Data</CardTitle>
        </CardHeader>
      )}
      renderBody={() => (
        <div className="card__body">
          <MeasurementsChart
            measurements={measurements}
            activeParam={activeTab}
          />
        </div>
      )}
      renderFooter={() => null}
    />
  );
}

ValuesBreakdown.propTypes = {
  parameters: T.array,

  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
