import React, { useState, useEffect } from 'react';
import { PropTypes as T } from 'prop-types';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

import { openDownloadModal } from '../../actions/action-creators';
import config from '../../config';
import { HeaderMessage } from '../../components/header';
import Header from '../../components/header';

import DetailsCard from '../../components/dashboard/details-card';
import NearbyLocations from './nearby-locations';
import LatestMeasurementsCard from '../../components/dashboard/lastest-measurements-card';
import SourcesCard from '../../components/dashboard/sources-card';
import MeasureandsCard from '../../components/dashboard/measurands-card';
import TemporalCoverageCard from '../../components/dashboard/temporal-coverage-card';
import TimeSeriesCard from '../../components/dashboard/time-series-card';
import MapCard from '../../components/dashboard/map-card';
import DateSelector from '../../components/date-selector';

import { buildQS } from '../../utils/url';
import { NO_CITY } from '../../utils/constants';

const defaultState = {
  fetched: false,
  fetching: false,
  error: null,
  data: null,
};

function Location(props) {
  let history = useHistory();
  let location = useLocation();
  const { id } = props.match.params;

  const [dateRange, setDateRange] = useState(
    qs.parse(location.search, { ignoreQueryPrefix: true }).dateRange
  );

  useEffect(() => {
    let query = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    });
    query.dateRange = dateRange;
    history.push(`${location.pathname}?${buildQS(query)}`);
  }, [dateRange]);

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

  //
  // Lifecycle stage of different sources.
  const lifecycle = (data.sources || [])
    .map(s => s.lifecycle_stage)
    .filter(Boolean);

  return (
    <section className="inpage">
      <Header
        tagline="Location"
        title={data.name}
        subtitle={`in ${data.city || NO_CITY}, ${data.country}`}
        action={{
          api: `${config.apiDocs}`,
          download: onDownloadClick,
          compare: `/compare/${encodeURIComponent(data.id)}`,
        }}
        sourceType={data.sensorType}
        isMobile={data.isMobile}
      />
      <div className="inpage__body">
        <DateSelector setDateRange={setDateRange} dateRange={dateRange} />
        <div className="inner dashboard-cards">
          <DetailsCard
            measurements={data.measurements}
            lifecycle={lifecycle}
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
            dateRange={dateRange}
            titleInfo={
              'The value of a pollutant over time during the specified window. While locations have varying time intervals over which they report, all time series charts show data at the same intervals. For one day or one month of data the hourly average is shown. For the project lifetime the daily averages are shown for the most recent week of data.'
            }
          />
          {data.isMobile && (
            <MapCard
              parameters={data.parameters}
              isMobile={data.isMobile}
              locationId={data.id}
              bbox={data.bounds}
              points={data.points}
              firstUpdated={data.firstUpdated}
              lastUpdated={data.lastUpdated}
            />
          )}
          <TemporalCoverageCard
            parameters={data.parameters}
            spatial="location"
            id={data.id}
            dateRange={dateRange}
            titleInfo={
              'The average number of measurements for each pollutant by hour, day, or month. In some views a window may be turned off if that view is not applicable to the selected time window.'
            }
            isMobile={data.isMobile}
          />
          <MeasureandsCard
            parameters={data.parameters}
            titleInfo={
              'The average of all values and total number of measurements for each pollutant during the chosen time window.'
            }
          />
        </div>
        <NearbyLocations
          locationId={data.id}
          center={[data.coordinates.longitude, data.coordinates.latitude]}
          city={data.city || NO_CITY}
          country={data.country}
          parameters={data.parameters}
          initialActiveParameter={data.parameters[0]}
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
  parameters: T.array,
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector(state) {
  return {
    parameters: state.baseData.data.parameters,
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
