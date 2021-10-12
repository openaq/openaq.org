import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import c from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import LoadingMessage from '../../components/loading-message';
import InfoMessage from '../../components/info-message';

import { NO_CITY } from '../../utils/constants';

export default function CompareLocation(props) {
  const { locationIndex, location, countries, onRemove } = props;
  if (location.fetching) {
    return (
      <li className="compare__location">
        <LoadingMessage type="minimal" />
      </li>
    );
  }

  if (location.error) {
    return (
      <li className="compare__location">
        <InfoMessage standardMessage />
      </li>
    );
  }

  const d = location.data;
  const kl = ['compare-marker--st', 'compare-marker--nd', 'compare-marker--rd'];
  const updated = moment(d.lastUpdated).fromNow();
  const countryData = _.find(countries, { code: d.country });
  return (
    <li className="compare__location" key={d.id}>
      <p className="compare__subtitle">Updated {updated}</p>
      <h2 className="compare__title">
        <Link to={`/location/${encodeURIComponent(d.id)}`}>
          <span className={c('compare-marker', kl[locationIndex])}>
            Sensor #{locationIndex + 1}
          </span>
        </Link>{' '}
        <small className="compare-location-name">{d.name}</small>
      </h2>
      <p className="compare-location-place">
        in {d.city || NO_CITY}, {countryData?.name}
      </p>
      <p className="compare-sensor-type">
        Sensor Type: <strong>{d.sensorType}</strong>
      </p>
      <p className="compare-parameters">
        Reporting: {d.parameters.map(p => p.displayName).join(', ')}
      </p>
      <div className="compare__actions">
        <button
          type="button"
          className="button button--small button--primary-unbounded"
          onClick={() => onRemove(locationIndex)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

CompareLocation.propTypes = {
  locationIndex: T.number,
  location: T.object,
  countries: T.array,
  onRemove: T.func,
};
