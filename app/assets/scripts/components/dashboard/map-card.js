import React, { useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import Card, { CardHeader as BaseHeader, CardTitle } from '../card';
import TabbedSelector from '../tabbed-selector';
import Map from '../mini-map';

const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

export default function MapCard({ parameters }) {
  const [activeTab, setActiveTab] = useState({
    id: parameters[0].parameter || parameters[0],
    name: parameters[0].parameter || parameters[0],
  });

  return (
    <Card
      gridColumn={'5  / 13'}
      renderHeader={() => (
        <CardHeader className="card__header">
          <TabbedSelector
            tabs={parameters.map(x => ({
              id: x.parameter || x,
              name: x.parameter || x,
            }))}
            activeTab={activeTab}
            onTabSelect={t => {
              setActiveTab(t);
            }}
          />

          <CardTitle>Total Count of Measurements</CardTitle>
        </CardHeader>
      )}
      renderBody={() => <Map style={{ height: `100%`, minHeight: `20rem` }} />}
    />
  );
}

MapCard.propTypes = {
  locationId: T.string,
  projectId: T.string,
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
    })
  ),
};
