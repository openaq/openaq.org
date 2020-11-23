import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';
import TemporalChart from '../../components/bar-chart-measurement';
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
  grid-template-rows: min-content 1fr;
  grid-gap: 0.5rem;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

export default function TemporalMeasurements({ measurements, parameters }) {
  const { fetched, fetching, error } = measurements;
  const [activeTab, setActiveTab] = useState(parameters[0]);
  const [activeTabMeasurments, setActiveTabMeasurments] = useState([]);
  const [hourCoverage, setHourCoverage] = useState([]);
  const [dayCoverage, setDayCoverage] = useState([]);
  const [monthCoverage, setMonthCoverage] = useState([]);

  useEffect(() => {
    if (fetched) {
      const tabMeasurements = measurements.data.results.filter(
        f => f.parameter === activeTab.id
      );
      setActiveTabMeasurments(tabMeasurements);
      setHourCoverage(parseHour(tabMeasurements));
      setDayCoverage(parseDay(tabMeasurements));
      setMonthCoverage(parseMonth(tabMeasurements));
    }
  }, [fetched, activeTab]);

  if (!fetched && !fetching) {
    return null;
  }

  const parseHour = measurements => {
    const hourCount = measurements.reduce((prev, curr) => {
      const hour = new Date(curr.date.local).getHours();
      prev[hour] = prev[hour] ? prev[hour] + 1 : 1;
      return prev;
    }, {});
    const orderedHoursCount = {};
    Object.keys(hourCount)
      .sort()
      .forEach(function (key) {
        orderedHoursCount[key] = hourCount[key];
      });
    return orderedHoursCount;
  };

  const parseDay = measurements => {
    const daysOfWeek = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];
    const dayCount = measurements.reduce((prev, curr) => {
      const day = daysOfWeek[new Date(curr.date.local).getDay()];
      prev[day] = prev[day] ? prev[day] + 1 : 1;
      return prev;
    }, {});
    let sortedDayCount = {};
    daysOfWeek.forEach(day =>
      dayCount[day]
        ? (sortedDayCount[day] = dayCount[day])
        : (sortedDayCount[day] = 0)
    );
    return sortedDayCount;
  };

  const parseMonth = measurements => {
    const monthOfYear = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUNE',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    const monthCount = measurements.reduce((prev, curr) => {
      const month = monthOfYear[new Date(curr.date.local).getMonth()];
      prev[month] = prev[month] ? prev[month] + 1 : 1;
      return prev;
    }, {});
    let sortedMonthCount = {};
    monthOfYear.forEach(month =>
      monthCount[month]
        ? (sortedMonthCount[month] = monthCount[month])
        : (sortedMonthCount[month] = 0)
    );
    return sortedMonthCount;
  };

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
          {activeTabMeasurments.length ? (
            <ChartContainer>
              <TemporalChart
                title="Hour of the Day"
                frequency={Object.values(hourCoverage)}
                xAxisLabels={Object.keys(hourCoverage)}
              />
              <TemporalChart
                title="Day of the Week"
                frequency={Object.values(dayCoverage)}
                xAxisLabels={Object.keys(dayCoverage)}
              />
              <TemporalChart
                title="Month of the Year"
                frequency={Object.values(monthCoverage)}
                xAxisLabels={Object.keys(monthCoverage)}
              />
            </ChartContainer>
          ) : (
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
          )}
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
