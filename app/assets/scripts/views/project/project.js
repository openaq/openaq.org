import React, { useEffect, useState } from 'react';
import { PropTypes as T } from 'prop-types';
import fetch from 'isomorphic-fetch';

import styled from 'styled-components';
import CardList from '../../components/card-list';
import config from '../../config';
import DetailsCard from '../../components/dashboard/details-card';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';
import MapCard from '../../components/dashboard/map-card';
import DatasetLocations from './map';
import Header, { LoadingHeader, ErrorHeader } from '../../components/header';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

const Dashboard = styled(CardList)`
  padding: 2rem 4rem;
`;

function Project(props) {
  const { id } = props.match.params;

  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    const fetchData = id => {
      setState(state => ({ ...state, fetching: true, error: null }));
      fetch(`${config.api}/projects/${encodeURIComponent(id)}`)
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
              data: json.results[0],
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

    fetchData(id);

    return () => {
      setState(defaultState);
    };
  }, []);

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return <LoadingHeader />;
  }

  if (error || !data) {
    return <ErrorHeader />;
  }

  console.log('data', data);
  return (
    <section className="inpage">
      <Header
        tagline="Datasets"
        title={data.name}
        subtitle={data.subtitle}
        action={{
          api: `${config.api}/projects/${data.id}`,
          download: () => {},
        }}
      />
      <div className="inpage__body">
        <DatasetLocations
          locationId={data.id}
          coordinates={data.coordinates}
          parameters={[data.parameters[0]]}
          activeParameter={data.parameters[0].measurand}
        />
        <header
          className="fold__header inner"
          style={{ gridTemplateColumns: `1fr` }}
        >
          <h1 className="fold__title">Values for selected stations</h1>
        </header>
        <Dashboard
          gridTemplateRows={'repeat(4, 20rem)'}
          gridTemplateColumns={'repeat(12, 1fr)'}
          className="inner"
        >
          <DetailsCard
            measurements={data.measurements}
            date={{
              start: data.firstUpdated,
              end: data.lastUpdated,
            }}
          />
          <LatestMeasurementsCard parameters={data.parameters} />
          <SourcesCard sources={data.sources} />
          <TimeSeriesCard
            projectId={data.id}
            parameters={data.parameters}
            xUnit="day"
          />
          <MeasureandsCard parameters={data.parameters} />
          <MapCard parameters={data.parameters} points={data.points} />
          <TemporalCoverageCard
            parameters={data.parameters}
            spatial="project"
            id={data.name}
          />
        </Dashboard>
      </div>
    </section>
  );
}

Project.propTypes = {
  match: T.object, // from react-router
};

export default Project;
