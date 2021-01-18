import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function CardDetails({ list, id }) {
  return (
    <dl data-cy={`${id}-card-detail`} className="card__meta-details">
      {list.map((d, i) => (
        <React.Fragment key={i}>
          <dt data-cy={`${id}-card-detail-label`}>{d.label}</dt>
          <dd>{d.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

CardDetails.propTypes = {
  id: T.string,
  list: T.arrayOf(
    T.shape({
      label: T.string.isRequired,
      value: T.oneOfType([T.string, T.node]).isRequired,
    })
  ).isRequired,
};
