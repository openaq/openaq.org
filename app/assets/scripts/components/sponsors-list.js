import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

class SponsorsList extends Component {
  render () {
    return (
      <ul className='sponsor-list'>
        {this.props.items.map(({ name, logo, url }) => (
          <li key={url}>
            <a title={`Visit ${name} website`} className='sponsor-list__item' target='_blank' href={url}>
              <img src={`/assets/graphics/content/${logo}`} alt={`${name} logo`} />
              <span>{name}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

if (environment !== 'production') {
  SponsorsList.propTypes = {
    items: T.array
  };
}

export default SponsorsList;
