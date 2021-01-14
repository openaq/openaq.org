import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function Pill({ title, action }) {
  return (
    <button className="button--pill" onClick={action} data-cy="simple-pill">
      <span>{title}</span>
    </button>
  );
}

Pill.propTypes = {
  title: T.string.isRequired,
  action: T.func,
};
