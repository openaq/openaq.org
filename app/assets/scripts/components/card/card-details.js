import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function CardDetails({ list }) {
  return (
    <dl className="card__meta-details">
      {list.map((d, i) => (
        <React.Fragment key={i}>
          <dt>{d.label}</dt>
          <dd>{d.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

CardDetails.propTypes = {
  list: T.arrayOf(
    T.shape({
      label: T.string.isRequired,
      value: T.string.isRequired,
    })
  ).isRequired,
};
