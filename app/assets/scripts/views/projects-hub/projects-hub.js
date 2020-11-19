import React from 'react';
import { PropTypes as T } from 'prop-types';

import Header from './header';
import Filter from './filter';
import Results from './results';

export default function ProjectHub({
  organizations,
  parameters,
  sources,
  found,
}) {
  return (
    <section className="inpage">
      <Header
        title="Datasets"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      />

      <div className="inpage__body">
        <div className="inner">
          <div className="inpage__content">
            <div className="inpage__content__header">
              <Filter
                organizations={organizations}
                parameters={parameters}
                sources={sources}
              />
            </div>
            <div className="content__meta">
              <div className="content__header">
                <div className="content__heading">
                  <h2 className="content-prime-title">Results</h2>
                  {found ? (
                    <p className="results-summary">
                      A total of <strong>{found}</strong> datasets were found
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="inpage__results">
              <Results />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ProjectHub.propTypes = {
  organizations: T.array,
  parameters: T.array,
  sources: T.array,
  found: T.number,
};
