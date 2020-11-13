import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import config from '../../config';

export default function Header({
  location,
  area,
  country,
  countryCode,
  openDownloadModal,
}) {
  function onDownloadClick() {
    openDownloadModal({
      country: countryCode,
      area,
      location,
    });
  }

  return (
    <header className="inpage__header">
      <div className="inner">
        <div className="inpage__headline">
          <p className="inpage__subtitle">location</p>
          <h1 className="inpage__title">
            {location}{' '}
            <small>
              in {area}, {country}
            </small>
          </h1>
          <ul className="ipha">
            <li>
              <a
                href={`${config.api}/locations?location=${location}`}
                title="View in API documentation"
                className="ipha-api"
                target="_blank"
                rel="noreferrer"
              >
                View API
              </a>
            </li>
            <li>
              <button
                type="button"
                title="Download data for this location"
                className="ipha-download"
                onClick={onDownloadClick}
              >
                Download
              </button>
            </li>
            <li>
              <Link
                to={`/compare/${encodeURIComponent(location)}`}
                title="Compare location with another"
                className="ipha-compare ipha-main"
              >
                <span>Compare</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <figure className="inpage__media inpage__media--cover media">
        <div className="media__item">
          <img
            src="/assets/graphics/content/view--home/cover--home.jpg"
            alt="Cover image"
            width="1440"
            height="712"
          />
        </div>
      </figure>
    </header>
  );
}

Header.propTypes = {
  location: T.string,
  area: T.string,
  countryCode: T.string,
  country: T.string,
  openDownloadModal: T.func,
};
