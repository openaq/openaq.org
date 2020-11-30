import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

export default function Header({
  tagline,
  title,
  subtitle,
  description,
  action,
}) {
  return (
    <header className="inpage__header">
      <div className="inner">
        <div className="inpage__headline">
          {tagline && <p className="inpage__subtitle">{tagline}</p>}
          <h1 className="inpage__title">
            {title}
            {subtitle && <small>{subtitle}</small>}
          </h1>
          {description && (
            <div className="inpage__introduction">
              <p>{description}</p>
            </div>
          )}
          {action && (
            <ul className="ipha">
              {action.api && (
                <li>
                  <a
                    href={action.api}
                    title="View in API documentation"
                    className="ipha-api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View API
                  </a>
                </li>
              )}
              {action.download && (
                <li>
                  <button
                    type="button"
                    title="Download data for this location"
                    className="ipha-download"
                    onClick={action.download}
                  >
                    Download
                  </button>
                </li>
              )}
              {action.compare && (
                <li>
                  <Link
                    to={action.compare}
                    title="Compare location with another"
                    className="ipha-compare ipha-main"
                  >
                    <span>Compare</span>
                  </Link>
                </li>
              )}
            </ul>
          )}
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
  tagline: T.string,
  title: T.string.isRequired,
  subtitle: T.string,
  description: T.string,
  action: T.shape({
    api: T.string,
    download: T.func,
    compare: T.string,
  }),
};
