import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function CommunityCard({
  title,
  type,
  location,
  // linkTitle,
  url,
  // imageNode,
  logo,
  // horizontal,
  children,
}) {
  return (
    <li>
      <article className="card card--project">
        <a href={url} className="card__contents" title="View project">
          <header className="card__header">
            <div className="card__headline">
              <p className="card__subtitle">{type || 'N/A'}</p>
              <h1 className="card__title">{title}</h1>
            </div>
          </header>
          <div className="card__body">{children}</div>
          <footer className="card__footer">
            <p className="card__footer-detail">{location || 'N/A'}</p>
            {logo && <img src={logo} alt="Project logo" />}
          </footer>
        </a>
      </article>
    </li>
  );
}

CommunityCard.propTypes = {
  title: T.string,
  type: T.string,
  location: T.string,
  linkTitle: T.string,
  url: T.string,
  imageNode: T.node,
  logo: T.string,
  horizontal: T.bool,
  children: T.object,
};

CommunityCard.defaultProps = {
  horizontal: false,
};
