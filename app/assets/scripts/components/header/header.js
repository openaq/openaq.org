import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

const Tags = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  width: fit-content;
  grid-template-columns: 1fr 1fr;
`;

export default function Header({
  id,
  tagline,
  title,
  subtitle,
  description,
  stats,
  disclaimer,
  action,
  isMobile,
  sourceType,
}) {
  return (
    <header className="inpage__header" data-cy={`${id}-header`}>
      <div className="inner">
        <div className="inpage__headline">
          {tagline && (
            <p className="inpage__subtitle" data-cy={`${id}-header-tagline`}>
              {tagline}
            </p>
          )}
          <h1 className="inpage__title" data-cy={`${id}-header-title`}>
            {title}
            {subtitle && <small>{subtitle}</small>}
          </h1>
          {description && (
            <div className="inpage__introduction">
              <p>{description}</p>
              {disclaimer && (
                <small className="disclaimer">
                  <a href="https://medium.com/@openaq/where-does-openaq-data-come-from-a5cf9f3a5c85">
                    Data Disclaimer and More Information
                  </a>
                </small>
              )}
            </div>
          )}
          {stats && (
            <ul className="country-stats" data-cy={`${id}-header-stats`}>
              {stats.map(stat => (
                <li
                  key={stat.label}
                  data-cy={`${id}-header-stat-${stat.label}`}
                >
                  <strong>{stat.number}</strong> {stat.label}
                </li>
              ))}
            </ul>
          )}

          <Tags>
            {sourceType && (
              <div className="header__pill">
                {`${sourceType[0].toUpperCase()}${sourceType.slice(1)}`}
              </div>
            )}
            {isMobile !== undefined && (
              <div className="header__pill">
                {isMobile ? 'Mobile' : 'Stationary'}
              </div>
            )}
          </Tags>

          {action && (
            <ul className="ipha">
              {action.api && (
                <li>
                  <a
                    data-cy={`header-apidocs-btn`}
                    href={action.api}
                    title="View in API documentation"
                    className="ipha-api"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View API Docs
                  </a>
                </li>
              )}
              {action.download && (
                <li>
                  <button
                    data-cy={`header-download-btn`}
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
  id: T.string,
  tagline: T.string,
  title: T.string.isRequired,
  subtitle: T.string,
  isMobile: T.bool,
  sourceType: T.string,
  description: T.oneOfType([T.string, T.node]),
  stats: T.arrayOf(
    T.shape({
      number: T.oneOfType([T.string, T.number]),
      label: T.string,
    })
  ),
  disclaimer: T.func,
  action: T.shape({
    api: T.string,
    download: T.func,
    compare: T.string,
  }),
};
