import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import qs from 'qs';
import config from '../../config';
import LoadingMessage from '../loading-message';
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
  titleInfo,
}) {
  // eslint-disable-next-line no-unused-vars
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  const [activeTab, setActiveTab] = useState({
    id: parameters[0].parameter || parameters[0],
    name: parameters[0].parameter || parameters[0],
  });

  const [year, month, day] = (dateRange ? dateRange.split('/') : []).map(
    Number
  );

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
              // In user space, month is 1 indexed
              date_from: new Date(year, month - 1, day || 1),
              date_to: day
                ? new Date(year, month - 1, day + 1)
                : new Date(year, month, 0),
            }
          : {}),
      };

      if (locationId) {
        query = { ...query, location: locationId, spatial: 'location' };
      } else if (projectId) {
        query = { ...query, project: projectId, spatial: 'project' };
      }
      //If date range is not lifetime, get hourly data
      if (dateRange) {
        query = {
          ...query,
          temporal: 'hour',
        };
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

  console.log(data);
  return (
    <Card
      id="time-series"
      className="card--time-series"
      renderHeader={() => (
        <CardHeader className="card__header">
          <TabbedSelector
            tabs={parameters.map(x => ({
              id: x.parameter || x.id,
              name: x.displayName || x.name,
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
          {fetching ? (
            <LoadingMessage />
          ) : data && data.length ? (
            <LineChart
              data={data.map(m => ({ x: new Date(m[temporal]), y: m.average }))}
              yLabel={data && data[0].displayName}
              yUnit={data && data[0].unit}
              xUnit={temporal}
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
  locationId: T.oneOfType([T.string, T.number]),
  projectId: T.string,
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
    })
  ),
  dateRange: T.string,
};
