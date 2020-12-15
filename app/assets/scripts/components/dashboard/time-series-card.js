import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import qs from 'qs';
import moment from 'moment';

import config from '../../config';
import LoadingMessage from '../loading-message';
import InfoMessage from '../info-message';
import Card, { CardHeader as BaseHeader, CardTitle } from '../card';
import TabbedSelector from '../tabbed-selector';
import LineChart from '../line-chart';

const ChartContainer = styled.div`
  max-height: 24rem;
  padding: 0;
`;

const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

const ErrorMessage = () => (
  <div>
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
  </div>
);

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

export default function TimeSeriesCard({
  locationId,
  projectId,
  parameters,
  dateRange,
}) {
  // eslint-disable-next-line no-unused-vars
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  const [activeTab, setActiveTab] = useState({
    id: parameters[0].measurand || parameters[0],
    name: parameters[0].measurand || parameters[0],
  });

  const [year, month, day] = dateRange ? dateRange.split('/') : [];

  // eslint-disable-next-line no-unused-vars
  const [temporal, setTemporal] = useState(day ? 'hour' : 'day');

  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetching: true, error: null }));

      let query = {
        parameter: activeTab.id,
        temporal,
        ...(dateRange
          ? {
              date_from: new Date(year, month - 1, day || 1),
              date_to: day
                ? new Date(year, month - 1, day)
                : new Date(year, month, 0),
            }
          : {}),
      };

      if (locationId) {
        query = { ...query, location: locationId, spatial: 'location' };
      } else if (projectId) {
        query = { ...query, project: projectId, spatial: 'project' };
      }

      fetch(
        `${config.api}/averages?${qs.stringify(query, { skipNulls: true })}`
      )
        .then(response => {
          if (response.status >= 400) {
            throw new Error('Bad response');
          }
          return response.json();
        })
        .then(
          json => {
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              data: json.results,
            }));
          },
          e => {
            console.log('e', e);
            setState(state => ({
              ...state,
              fetched: true,
              fetching: false,
              error: e,
            }));
          }
        );
    };

    fetchData();

    return () => {
      setState(defaultState);
    };
  }, [activeTab, temporal, dateRange]);

  if (!fetched && !fetching) {
    return null;
  }

  return (
    <Card
      gridColumn={'1  / -1'}
      renderHeader={() => (
        <CardHeader className="card__header">
          <TabbedSelector
            tabs={parameters.map(x => ({
              id: x.measurand || x,
              name: x.measurand || x,
            }))}
            activeTab={activeTab}
            onTabSelect={t => {
              setActiveTab(t);
            }}
          />
          <CardTitle>Time Series Data</CardTitle>
        </CardHeader>
      )}
      renderBody={() => (
        <ChartContainer className="card__body">
          {fetching ? (
            <LoadingMessage />
          ) : data ? (
            <LineChart
              data={data.map(m => ({ x: new Date(m[temporal]), y: m.average }))}
            />
          ) : (
            <ErrorMessage />
          )}
        </ChartContainer>
      )}
    />
  );
}

TimeSeriesCard.propTypes = {
  locationId: T.oneOfType([T.string, T.number]),
  projectId: T.string,
  parameters: T.arrayOf(
    T.shape({
      measurand: T.string.isRequired,
    })
  ),
};
