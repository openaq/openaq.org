import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function CardTag({ label }) {
  return (
    label && (
      <div className="filter-pill card__tag">{`${label[0].toUpperCase()}${label.slice(
        1
      )}`}</div>
    )
  );
}

CardTag.propTypes = {
  label: T.string.isRequired,
};
