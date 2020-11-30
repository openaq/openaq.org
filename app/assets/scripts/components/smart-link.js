import React from 'react';
import { PropTypes as T } from 'prop-types';

import { Link } from 'react-router-dom';
import _ from 'lodash';

/**
 * Switches between a `a` and a `Link` depending on the url.
 */
export default function SmartLink(props) {
  const { to } = props;
  const forwardProps = _.omit(props, 'to');

  return /^https?:\/\//.test(to) || /^mailto:/.test(to) ? (
    <a href={to} {...forwardProps} target="_blank" rel="noopener noreferrer" />
  ) : (
    <Link to={to} {...forwardProps} />
  );
}

SmartLink.propTypes = {
  to: T.string,
};
