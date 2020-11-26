import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-fetch';

import HeaderMessage from '../../components/header-message';

import Header from '../location/header';

import styled from 'styled-components';
import CardList from '../../components/card-list';
import config from '../../config';

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
      fetch(`${config.api}/projects/US&metadata=true`)
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
        location={data.location}
        area={data.city}
        countryCode={data.country}
        country={'test'}
        openDownloadModal={() => {}}
      />
      <div className="inpage__body">
        <Dashboard
          gridTemplateRows={'repeat(4, 20rem)'}
          gridTemplateColumns={'repeat(12, 1fr)'}
          className="inner"
        ></Dashboard>
      </div>
    </section>
  );
}

Project.propTypes = {};

export default Project;
