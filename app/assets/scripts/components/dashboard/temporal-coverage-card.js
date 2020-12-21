import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import qs from 'qs';

import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import BarChart from '../bar-chart';
import Card, {
  CardHeader as BaseHeader,
  CardTitle,
} from '../../components/card';
import TabbedSelector from '../../components/tabbed-selector';
import config from '../../config';

const StyledLoading = styled(LoadingMessage)`
  grid-column: 4 / 11;
`;

const ChartLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const ChartContainer = styled.div`
  padding: 1rem;
`;

const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

const defaultState = {
  hod: {
    fetched: false,
    fetching: false,
    error: null,
    data: null,
  },
  dow: {
    fetched: false,
    fetching: false,
    error: null,
    data: null,
  },
  moy: {
    fetched: false,
    fetching: false,
    error: null,
    data: null,
  },
};

const ErrorMessage = () => (
  <div className="fold__introduction prose prose--responsive">
    <p>{"We couldn't get this data. Please try again later."}</p>
    <p>
      {"If you think there's a problem, please "}
      <a href="mailto:info@openaq.org" title="Contact openaq">
        contact us.
      </a>
    </p>
  </div>
);

export default function TemporalCoverageCard({ parameters, spatial, id }) {
  const [activeTab, setActiveTab] = useState({
    id: parameters[0].parameter || parameters[0],
    name: parameters[0].parameter || parameters[0],
  });

  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const fetchData = temporal => {
      setState(state => ({
        ...state,
        [temporal]: { ...state[temporal], fetching: true, error: null },
      }));

      let query = {
        temporal,
        parameter: activeTab.id,
        spatial,
      };

      if (spatial === 'project') {
        query = {
          ...query,
          project: id,
        };
      } else {
        query = {
          ...query,
          location: id,
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
              [temporal]: {
                ...state[temporal],
                fetched: true,
                fetching: false,
                data: json.results,
              },
            }));
          },
          e => {
            console.log('e', e);
            setState(state => ({
              ...state,
              [temporal]: {
                ...state[temporal],
                fetched: true,
                fetching: false,
                error: e,
              },
            }));
          }
        );
    };

    ['dow', 'moy'].forEach(t => {
      fetchData(t);
    });
    return () => {
      setState(defaultState);
    };
  }, [activeTab]);

  /** I am keeping all the data fetching in this parent component
   *  just to be able to render a generic loading or error message
   *  in case all 3 charts have the same status
   *  Is it really worth it? Would be a lot cleaner to move data
   *  fetching into the chart component itself.
   * */
  const noData =
    state.hod.fetched &&
    state.dow.fetched &&
    state.moy.fetched &&
    (!state.hod.data || state.hod.data < 1) &&
    (!state.dow.data || state.dow.data < 1) &&
    (!state.moy.data || state.moy.data < 1);

  if (state.hod.fetching && state.dow.fetching && state.moy.fetching) {
    return <StyledLoading />;
  } else if (state.hod.error && state.dow.error && state.moy.error) {
    return <ErrorMessage />;
  }

  return (
    <Card
      gridColumn={'1  / -1'}
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
          <CardTitle>Temporal Coverage</CardTitle>
        </CardHeader>
      )}
      renderBody={() =>
        noData ? (
          <InfoMessage>
            <p>There are no data for the selected parameter.</p>
            <p>
              Maybe you&apos;d like to suggest a{' '}
              <a
                href="https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform"
                title="Suggest a new source"
              >
                new source
              </a>
              .
            </p>
          </InfoMessage>
        ) : (
          <ChartLayout>
            <Chart
              title="Hour of the Day"
              temporal="hod"
              data={state.hod.data}
              fetching={state.hod.fetching}
            />
            <Chart
              title="Day of the Week"
              temporal="dow"
              data={state.dow.data}
              fetching={state.dow.fetching}
            />
            <Chart
              title="Month of the Year"
              temporal="moy"
              data={state.moy.data}
              fetching={state.moy.fetching}
            />
          </ChartLayout>
        )
      }
    />
  );
}

TemporalCoverageCard.propTypes = {
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
      count: T.number.isRequired,
      average: T.number.isRequired,
    })
  ),
  spatial: T.oneOf(['project', 'location']).isRequired,
  id: T.oneOfType([T.string, T.number]).isRequired,
};

function Chart({ title, temporal, data, fetching }) {
  return (
    <ChartContainer>
      <div className="header">
        <h3 className="title">{title}</h3>
      </div>
      {fetching ? (
        <LoadingMessage />
      ) : data ? (
        <BarChart
          data={data.map(m => m.average)}
          // data={data.map(m => m.measurement_count)}
          yAxisLabel="average"
          // yAxisLabel="count"
          xAxisLabels={data.map(m => m[temporal])}
        />
      ) : (
        <ErrorMessage />
      )}
    </ChartContainer>
  );
}

Chart.propTypes = {
  title: T.string.isRequired,
  temporal: T.oneOf(['hod', 'dow', 'moy']).isRequired,
  data: T.arrayOf(
    T.shape({
      average: T.number,
      hod: T.string,
      dow: T.string,
      moy: T.string,
    })
  ),
  fetching: T.bool.isRequired,
};
