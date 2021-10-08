import React from 'react';
import { PropTypes as T } from 'prop-types';
import moment from 'moment';

export default function AvailabilityMessage(props) {
  const { activeParam, compareLocations } = props;
  // Prepare data.
  const weekAgo = moment().subtract(21, 'days').toISOString();
  const messages = compareLocations
    .filter(o => o.fetched && !o.fetching && o.data)
    .map(o => {
      if (!o.data.parameters.find(p => p.parameterId === activeParam.id)) {
        return (
          <p key={o.data.id}>
            {o.data.name} does not report {activeParam.displayName}.
          </p>
        );
      }

      if (o.data.lastUpdated < weekAgo) {
        return (
          <p key={o.data.id}>
            {o.data.name} has not reported values in the last week.
          </p>
        );
      }

      return null;
    })
    .filter(o => o !== null);

  return <div className="compare__info-msg">{messages}</div>;
}

AvailabilityMessage.propTypes = {
  activeParam: T.object,
  compareLocations: T.array,
};
