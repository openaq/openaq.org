import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { openDownloadModal } from '../../actions/action-creators';
import config from '../../config';
import { HeaderMessage } from '../../components/header';
import Header from '../../components/header';
import CardList from '../../components/card-list';

import DetailsCard from '../../components/dashboard/details-card';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';
import MapCard from '../../components/dashboard/map-card';
import NearbyLocations from './nearby-locations';

const Dashboard = styled(CardList)`
  padding: 2rem 4rem;
`;

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

function Location(props) {
  const { id } = props.match.params;

  const [{ fetched, fetching, error, data }, setState] = useState(defaultState);

  useEffect(() => {
    const fetchData = id => {
      setState(state => ({ ...state, fetching: true, error: null }));

      fetch(`${config.api}/locations/${encodeURIComponent(id)}`)
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
  }, [id]);

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

  function onDownloadClick() {
    props._openDownloadModal({
      country: data.country,
      area: data.city,
      location: data.location,
    });
  }

  return (
    <section className="inpage">
      <Header
        tagline="Location"
        title={data.name}
        subtitle={`in ${data.city}, ${data.country}`}
        action={{
          api: `${config.api}/locations?location=${data.id}`,
          download: onDownloadClick,
          compare: `/compare/${encodeURIComponent(data.id)}`,
        }}
        sourceType={data.sourceType}
        isMobile={data.isMobile}
      />
      <div className="inpage__body">
        <Dashboard
          gridTemplateRows={'repeat(4, 20rem)'}
          gridTemplateColumns={'repeat(12, 1fr)'}
          className="inner"
        >
          <DetailsCard
            measurements={data.measurements}
            coords={{
              lat: data.coordinates.latitude,
              lng: data.coordinates.longitude,
            }}
            date={{
              start: data.firstUpdated,
              end: data.lastUpdated,
            }}
          />
          <LatestMeasurementsCard parameters={data.parameters} />
          <SourcesCard sources={data.sources} />
          <TimeSeriesCard
            locationId={data.id}
            parameters={data.parameters}
            xUnit="day"
          />
          <MeasureandsCard parameters={data.parameters} />
          <MapCard
            parameters={data.parameters}
            isMobile={data.isMobile}
            locationId={data.id}
            center={[data.coordinates.longitude, data.coordinates.latitude]}
            points={data.points}
          />
          <TemporalCoverageCard
            parameters={data.parameters}
            spatial="location"
            id={data.id}
          />
        </Dashboard>
        <NearbyLocations
          locationId={data.id}
          center={[data.coordinates.longitude, data.coordinates.latitude]}
          city={data.city}
          country={data.country}
          parameters={[data.parameters[0]]}
          activeParameter={data.parameters[0].parameter}
        />
      </div>
    </section>
  );
}

Location.propTypes = {
  match: T.object,
  _openDownloadModal: T.func,
  sources: T.array,
  measurements: T.array,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    sources: state.baseData.data.sources,
    measurements: state.measurements,
    latestMeasurements: state.latestMeasurements,
  };
}

function dispatcher(dispatch) {
  return {
    _openDownloadModal: (...args) => dispatch(openDownloadModal(...args)),
  };
}

export default connect(selector, dispatcher)(Location);
