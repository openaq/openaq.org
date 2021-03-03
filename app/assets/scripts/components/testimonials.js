import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';
import pngImages from '../../graphics/content/community/*.png';
import jpgImages from '../../graphics/content/community/*.jpg';
import jpegImages from '../../graphics/content/community/*.jpeg';
import placeholder from '../../graphics/content/team/avatar--placeholder.jpg';

function getImage(logo) {
  const filename = logo.split('community/')[1].split('.')[0];
  return (
    pngImages[filename] ||
    jpgImages[filename] ||
    jpegImages[filename] ||
    placeholder
  );
}
class Testimonials extends Component {
  constructor(props) {
    super(props);

    this.renderListItem = this.renderListItem.bind(this);
  }

  renderListItem(testimonial) {
    const {
      image,
      short_quote: shortQuote,
      long_quote: longQuote,
      name,
      title,
      affiliation,
      location,
    } = testimonial;

    const details = [title, affiliation, location].filter(Boolean).join(' / ');

    return (
      <li key={testimonial}>
        <blockquote className="testimonial">
          <div className="testimonial__media">
            <img
              src={getImage(image)}
              width="960"
              height="960"
              alt="Image placeholder"
            />
          </div>
          <div className="testimonial__copy">
            <div className="testimonial__quote">
              <p>{shortQuote || longQuote}</p>
            </div>
            <footer className="testimonial__footer">
              <strong>{name}</strong>
              <small>{details}</small>
            </footer>
          </div>
        </blockquote>
      </li>
    );
  }

  render() {
    return (
      <section className="testimonials">
        <div className="inner">
          <h1 className="testimonials__title">Testimonials</h1>
          <ol className="testimonials-list">
            {this.props.items.map(this.renderListItem)}
          </ol>
        </div>
      </section>
    );
  }
}

if (environment !== 'production') {
  Testimonials.propTypes = {
    items: T.array,
  };
}

export default Testimonials;
