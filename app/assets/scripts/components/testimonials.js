import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';

import { environment } from '../config';

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

    const img = image
      ? `/assets/graphics/content/${image}`
      : 'https://use.placeimage.app/960x960';

    return (
      <li key={testimonial}>
        <blockquote className="testimonial">
          <div className="testimonial__media">
            <img src={img} width="960" height="960" alt="Image placeholder" />
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
