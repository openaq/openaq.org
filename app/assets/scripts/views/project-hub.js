import React from 'react';
import { PropTypes as T } from 'prop-types';

export default function ProjectHub(props) {
  return (
    <section className="inpage">
      <header className="inpage__header">
        <div className="inner">
          <div className="inpage__headline">
            <h1 className="inpage__title">Datasets</h1>
            <div className="inpage__introduction">
              <p>Lorem ipsum</p>
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

      <div className="inpage__body">
        <div className="inner">
          <div className="inpage__content">
            <div className="inpage__content__header">{/* Header */}</div>
            <div className="content__meta">
              <div className="content__header">
                <div className="content__heading">
                  <h2 className="content-prime-title">Results</h2>
                  {props.found ? (
                    <p className="results-summary">
                      A total of <strong>{props.found}</strong> datasets were
                      found
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="inpage__results">{/* Content */}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

ProjectHub.propTypes = {
  found: T.number,
};
