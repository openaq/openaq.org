import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function Pill({ title }) {
  return (
    <div className="button--pill" data-cy="simple-pill">
      <span>{title}</span>
    </div>
  );
}

Pill.propTypes = {
  title: T.string.isRequired,
};
