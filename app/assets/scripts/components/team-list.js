import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

class TeamList extends Component {
  renderListItem (person) {
    const {
      image,
      name,
      role
    } = person;

    const img = image
      ? `/assets/graphics/content/${image}`
      : '/assets/graphics/content/team/avatar--placeholder.jpg';

    return (
      <li key={name}>
        <article className='team-member'>
          <figure className='team-member__avatar'>
            <img src={img} width='320' height='320' alt='Team avatar' />
          </figure>
          <h1 className='team-member__title'>{name}</h1>
          <p className='team-member__role'>{role}</p>
        </article>
      </li>
    );
  }

  render () {
    return (
      <ul className='team-list'>
        {this.props.items.map(person => this.renderListItem(person))}
      </ul>
    );
  }
}

if (environment !== 'production') {
  TeamList.propTypes = {
    items: T.array
  };
}

export default TeamList;
