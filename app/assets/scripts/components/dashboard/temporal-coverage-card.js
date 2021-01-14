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
  CardHeadline,
} from '../../components/card';
import TabbedSelector from '../../components/tabbed-selector';
import config from '../../config';
import InfoButton from '../info-button';

const StyledLoading = styled(LoadingMessage)`
  grid-column: 4 / 11;
`;

const CardHeader = styled(BaseHeader)`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

// These formats correspond to the value of
// length of dateRange.split('/')
// In this case dateRange is null === entire project
// OR length 2 -> single month (YYYY/MM)
// OR length3 -> single day (YYYY/MM/DD)
const LIFETIME_FORMAT = null;
const MONTH_FORMAT = 2;
const DAY_FORMAT = 3;
const MOBILE_ONLY = true;

const defaultState = {
  hod: {
    fetched: false,
    fetching: false,
    error: null,
    data: null,
    // This is currently not getting requested at all
    // Define date type as potential values for dateRange
    // OR length of dateRange.split('/')
    // In this case dateRange is null === entire project
    // OR length 2 -> single month (YYYY/MM)
    // Single day is not accepted
    //dateRangeType: [null, 2, 3],
    dateRangeType: [
      //[LIFETIME_FORMAT, MOBILE_ONLY],
      [MONTH_FORMAT, MOBILE_ONLY],
      [DAY_FORMAT, MOBILE_ONLY],
    ],
  },
  dow: {
    fetched: false,
    fetching: false,
    error: null,
    data: null,
    // Define date type as potential values for dateRange
    // OR length of dateRange.split('/')
    // In this case dateRange is null === entire project
    // OR length 2 -> single month (YYYY/MM)
    // Single day is not accepted
    //dateRangeType: [null, 2],
    dateRangeType: [[LIFETIME_FORMAT], [MONTH_FORMAT], [DAY_FORMAT]],
  },
  moy: {
    fetched: false,
    fetching: false,
    error: null,
    data: null,
    // Define date type as potential values for dateRange
    // OR length of dateRange.split('/')
    // In this case dateRange is null === entire project
    // Single day is not accepted, Single month not accepted
    //dateRangeType: [null],
    dateRangeType: [[LIFETIME_FORMAT], [MONTH_FORMAT]],
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

export default function TemporalCoverageCard({
  parameters,
  spatial,
  id,
  dateRange,
  titleInfo,
  isMobile,
}) {
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
      const [year, month, day] = (dateRange ? dateRange.split('/') : []).map(
        Number
      );

      let query = {
        temporal,
        parameter: activeTab.id,
        spatial,

        ...(dateRange
          ? {
              date_from: new Date(year, month - 1, day || 1),
              date_to: day
                ? new Date(year, month - 1, day + 1)
                : new Date(year, month, 1),
            }
          : {}),
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

    const currentDateFormat = dateRange ? dateRange.split('/').length : null;

    Object.keys(state)
      .filter(temporal => {
        return state[temporal].dateRangeType.find(([format, mobileStatus]) => {
          return (
            format === currentDateFormat &&
            (mobileStatus === undefined || mobileStatus === isMobile)
          );
        });
        //return state[temporal].dateRangeType.includes(dateRangeType);
      })
      .forEach(t => {
        fetchData(t);
      });
    return () => {
      setState(defaultState);
    };
  }, [activeTab, dateRange]);

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

  const combinedDays =
    state.dow.data &&
    state.dow.data.reduce((prev, day) => {
      const dow = day.dow;
      return {
        ...prev,
        [dow]: {
          dow,
          measurement_count: prev[dow]
            ? prev[dow].measurement_count + day.measurement_count
            : day.measurement_count,
        },
      };
    }, {});

  if (state.hod.fetching && state.dow.fetching && state.moy.fetching) {
    return <StyledLoading />;
  } else if (state.hod.error && state.dow.error && state.moy.error) {
    return <ErrorMessage />;
  }

  return (
    <Card
      id="temporal-coverage"
      className="card--temporal-coverage"
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
            <CardTitle className="card__title">Temporal Coverage</CardTitle>
            {titleInfo && <InfoButton info={titleInfo} id="temp-cov-info" />}
          </CardHeadline>
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
          <div className="chart__list">
            <Chart
              title="Hour of the Day"
              temporal="hod"
              data={state.hod.data}
              fetching={state.hod.fetching}
              error={state.hod.error}
            />
            <Chart
              title="Day of the Week"
              temporal="dow"
              data={state.dow.data && Object.values(combinedDays)}
              error={state.dow.error}
              fetching={state.dow.fetching}
            />
            <Chart
              title="Month of the Year"
              temporal="moy"
              data={state.moy.data}
              error={state.moy.error}
              fetching={state.moy.fetching}
            />
          </div>
        )
      }
    />
  );
}

TemporalCoverageCard.propTypes = {
  titleInfo: T.string,
  parameters: T.arrayOf(
    T.shape({
      parameter: T.string.isRequired,
      count: T.number.isRequired,
      average: T.number.isRequired,
    })
  ),
  spatial: T.oneOf(['project', 'location']).isRequired,
  dateRange: T.string,
  id: T.oneOfType([T.string, T.number]).isRequired,
  isMobile: T.bool,
};

function Chart({ title, temporal, data, error, fetching }) {
  if (!data && !error) {
    return null;
  }
  return (
    <div className="chart__item">
      <div className="header">
        <h3 className="title">{title}</h3>
      </div>
      {fetching ? (
        <LoadingMessage />
      ) : data ? (
        <BarChart
          data={data.map(m => m.measurement_count)}
          yAxisLabel="Count"
          xAxisLabels={data.map(m => m[temporal])}
        />
      ) : !error ? (
        <p>Not applicable.</p>
      ) : (
        <ErrorMessage />
      )}
    </div>
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
  error: T.object,
  fetching: T.bool.isRequired,
};
