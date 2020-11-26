import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-fetch';

import HeaderMessage from '../../components/header-message';
import Header from '../../components/header';

import styled from 'styled-components';
import CardList from '../../components/card-list';
import config from '../../config';
import InfoCard from '../../components/info-card';
import LatestMeasurementsCard from '../../components/lastest-measurements-card';
import MeasureandsCard from '../../components/measurands-card';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

const Dashboard = styled(CardList)`
  padding: 2rem 4rem;
`;

function Project() {
  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    const fetchData = () => {
      setState(state => ({ ...state, fetching: true, error: null }));
      fetch(`${config.api}/projects/US`)
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
              error: error,
            }));
          }
        );
    };

    fetchData();

    return () => {
      setState(defaultState);
    };
  }, []);

  if (!fetched && !fetching) {
    return null;
  }

  if (fetching) {
    return (
      <HeaderMessage>
        <h1>Take a deep breath.</h1>
        <div className="prose prose--responsive">
          <p>Location data is loading...</p>
        </div>
      </HeaderMessage>
    );
  }

  if (error || !data) {
    return (
      <HeaderMessage>
        <h1>Uh oh, something went wrong.</h1>
        <div className="prose prose--responsive">
          <p>
            There was a problem getting the data. If you continue to have
            problems, please let us know.
          </p>
          <p>
            <a href="mailto:info@openaq.org" title="Send us an email">
              Send us an Email
            </a>
          </p>
        </div>
      </HeaderMessage>
    );
  }

  return (
    <section className="inpage">
      <Header
        tagline="Datasets"
        title={data.projectName}
        subtitle={data.subtitle}
        action={{
          api: `${config.api}/projects/${data.projectName}`,
          download: () => {},
        }}
      />
      <div className="inpage__body">
        <Dashboard
          gridTemplateRows={'repeat(4, 20rem)'}
          gridTemplateColumns={'repeat(12, 1fr)'}
          className="inner"
        >
          <InfoCard measurements={data.measurements} />
          <LatestMeasurementsCard measurements={data.parameters} />
          <MeasureandsCard measurements={data.parameters} />
        </Dashboard>
      </div>
    </section>
  );
}

Project.propTypes = {};

export default Project;
