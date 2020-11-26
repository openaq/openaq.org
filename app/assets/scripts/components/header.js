import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function Header({ title, description }) {
  return (
    <header className="inpage__header">
      <div className="inner">
        <div className="inpage__headline">
          <h1 className="inpage__title">{title}</h1>
          <div className="inpage__introduction">
            <p>{description}</p>
          </div>
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
  title: T.string,
  description: T.string,
};
