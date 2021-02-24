import React from 'react';
import { PropTypes as T } from 'prop-types';

import pngImages from '../../graphics/content/view--community-projects/projects/logos/*.png';
import jpgImages from '../../graphics/content/view--community-projects/projects/logos/*.jpg';
import jpegImages from '../../graphics/content/view--community-projects/projects/logos/*.jpeg';

import pngCoverImages from '../../graphics/content/view--community-projects/projects/covers/*.png';
import jpgCoverImages from '../../graphics/content/view--community-projects/projects/covers/*.jpg';
import jpegCoverImages from '../../graphics/content/view--community-projects/projects/covers/*.jpeg';

function getImage(logo) {
  const filename = logo?.split('logos/')[1]?.split('.')[0];
  const filenameCover = logo?.split('covers/')[1]?.split('.')[0];
  return (
    pngImages[filename] ||
    jpgImages[filename] ||
    jpegImages[filename] ||
    pngCoverImages[filenameCover] ||
    jpgCoverImages[filenameCover] ||
    jpegCoverImages[filenameCover] ||
    ''
  );
}
export default function CommunityCard({
  title,
  type,
  location,
  linkTitle,
  url,
  imageNode,
  logo,
  horizontal,
  children,
}) {
  console.log('logo', logo);
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
            {logo && <img src={getImage(logo)} alt="Project logo" />}
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
