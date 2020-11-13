import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';

export default function SourceInfo({ measurements, loc, sources: allSources }) {
  const { data } = measurements;

  let sources = loc.data.sourceNames
    .map(o => _.find(allSources, { name: o }))
    .filter(o => o);

  if (data.attribution) {
    // filtering attribution[0] b/c it kept showing up with same name and url as sources[0]
    let added = data.attribution.filter((src, index) => index !== 0);
    sources = [...sources, ...added];
  }

  return (
    <section className="fold" id="location-fold-source">
      <div className="inner">
        <header className="">
          <h1 className="fold__title">Sources</h1>
        </header>
        <div className="fold__body">
          <div className="col-main">
            <ul className="sources__list">
              {sources.map(source => (
                <li key={source.name}>
                  <p>
                    {source.sourceURL || source.url ? (
                      <a
                        href={source.sourceURL || source.url}
                        title="View source information"
                      >
                        {source.name}{' '}
                      </a>
                    ) : (
                      source.name
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {sources[0] && (
            <div className="col-sec">
              {sources[0].description ? <p>{sources[0].description}</p> : null}
              For more information contact{' '}
              <a
                href={`mailto:${sources[0].contacts[0]}`}
                title={sources[0].contacts[0]}
              >
                {sources[0].contacts[0]}
              </a>
              .
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

SourceInfo.propTypes = {
  sources: T.array,

  loc: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),

  measurements: T.shape({
    fetching: T.bool,
    fetched: T.bool,
    error: T.string,
    data: T.object,
  }),
};
