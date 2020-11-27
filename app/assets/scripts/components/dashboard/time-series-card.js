import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import qs from 'qs';
import DatePicker from 'react-datepicker';

import config from '../../config';
import LoadingMessage from '../loading-message';
import InfoMessage from '../info-message';
import Card, {
  CardHeader as BaseHeader,
  CardSubtitle,
  CardTitle,
} from '../card';
import TabbedSelector from '../tabbed-selector';
import LineChart from '../line-chart';

const ChartContainer = styled.div`
  max-height: 24rem;
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

export default function TimeSeriesCard({ locationId, projectId, parameters }) {
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  const [activeTab, setActiveTab] = useState({
    id: parameters[0].measurand || parameters[0],
    name: parameters[0].measurand || parameters[0],
  });
  const [temporal, setTemporal] = useState('month');
  const [dateRange, setDateRange] = useState({
    start: new Date('11/21/2019'),
    end: new Date(),
  });

  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetching: true, error: null }));

      let query = {
        parameter: activeTab.id,
        temporal,
        date_from: dateRange.start,
        date_to: dateRange.end,
      };
      if (locationId) {
        query = { ...query, location: locationId };
      }
      if (projectId) {
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
  }, [activeTab, dateRange, temporal]);

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
                  {`${dateRange.start.toDateString()} - ${
                    dateRange.end && dateRange.end.toDateString()
                  }`}
                </a>
              }
            />
          </DateSelector>
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
      renderFooter={() => null}
    />
  );
}

TimeSeriesCard.propTypes = {
  locationId: T.string,
  projectId: T.string,
  parameters: T.arrayOf(
    T.shape({
      measurand: T.string.isRequired,
    })
  ),
};
