import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

export default function FooterActions({ what, onDownloadClick, viewMorePath }) {
  return (
    <ul className="card__footer-actions">
      <li>
        <a
          href="#"
          className="cfa-download"
          title={`Download data for ${what}`}
          onClick={e => {
            e.preventDefault();
            onDownloadClick();
          }}
        >
          Download
        </a>
      </li>
      <li>
        <Link to={viewMorePath} className="cfa-go" title={`View ${what} page`}>
          View More
        </Link>
      </li>
    </ul>
  );
}

FooterActions.propTypes = {
  what: T.string.isRequired,
  onDownloadClick: T.func.isRequired,
  viewMorePath: T.string.isRequired,
};
