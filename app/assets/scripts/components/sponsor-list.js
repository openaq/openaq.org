import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';
import pngImages from '../../graphics/content/sponsors/*.png';
import jpgImages from '../../graphics/content/sponsors/*.jpg';
import jpegImages from '../../graphics/content/sponsors/*.jpeg';

function getImage(logo) {
  const filename = logo.split('/')[1].split('.')[0];
  return pngImages[filename] || jpgImages[filename] || jpegImages[filename];
}

class SponsorList extends Component {
  render() {
    return (
      <ul className="sponsor-list">
        {this.props.items.map(({ name, logo, url }) => (
          <li key={url} className="sponsor-list__item">
            <a
              title={`Visit ${name} website`}
              className="sponsor"
              target="_blank"
              rel="noreferrer"
              href={url}
            >
              <img src={getImage(logo)} alt={`${name} logo`} />
              <span>{name}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

if (environment !== 'production') {
  SponsorList.propTypes = {
    items: T.array,
  };
}

export default SponsorList;
