import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import TemporalChart from '../../components/bar-chart-measurment';
import Card, {
  CardHeader as BaseHeader,
  CardTitle,
} from '../../components/card';
import TabbedSelector from '../../components/tabbed-selector';

const ErrorMessage = styled.div`
  grid-column: 1 / -1;
`;
const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr 1fr;
  grid-gap: 0.5rem;
`;

export default function TemporalMeasurements({ measurements, parameters }) {
  const { fetched, fetching, error } = measurements;
  const [activeTab, setActiveTab] = useState(parameters[0]);

  if (!fetched && !fetching) {
    return null;
  }
console.log('measurements', measurements)
console.log('parameters', parameters)
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
          <CardTitle>Temporal Coverage</CardTitle>
        </CardHeader>
      )}
      renderBody={() => (
        <div className="card__body">
          <TemporalChart
            frequency="hour"
            data={[40, 10, 50, 30, 20, 50, 10]}
            activeParam={activeTab}
          />
        </div>
      )}
      renderFooter={() => null}
    />
  );
}

TemporalMeasurements.propTypes = {
  parameters: T.array,

  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
