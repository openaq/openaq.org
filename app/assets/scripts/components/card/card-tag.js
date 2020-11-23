import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function CardTag({ label }) {
  return (
    <div className="card__tags">
      {label && (
        <div className="filter-pill">{`${label[0].toUpperCase()}${label.slice(
          1
        )}`}</div>
      )}
    </div>
  );
}

CardTag.propTypes = {
  label: T.string.isRequired,
};
