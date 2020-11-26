import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DisabledLink = styled(Link)`
  pointer-events: none;
  color: grey;
  &:visited {
    color: grey;
  }
`;

export default function FooterActions({ what, onDownloadClick, viewMorePath }) {
  return (
    <ul className="card__footer-actions">
      <li>
        <a
          href="#"
          className="cfa-download"
          title={`Download data for ${what}`}
          onClick={onDownloadClick}
        >
          Download
        </a>
      </li>
      <li>
        {what === 'US' ? (
          <Link
            to={viewMorePath}
            className="cfa-go"
            title={`View ${what} page`}
          >
            View More
          </Link>
        ) : (
          <DisabledLink
            disabled
            to={viewMorePath}
            className="cfa-go"
            title={`View ${what} page`}
          >
            View More
          </DisabledLink>
        )}
      </li>
    </ul>
  );
}

FooterActions.propTypes = {
  what: T.string.isRequired,
  onDownloadClick: T.func.isRequired,
  viewMorePath: T.string.isRequired,
};
