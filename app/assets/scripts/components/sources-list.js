import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import config from '../config';

const Container = styled.ul`
  padding: 0;
  list-style: none;

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export default function SourcesList({ sources, showReadme, showOrganisation }) {
  return (
    <Container>
      {sources.map((source, idx) => (
        <li key={idx}>
          {source.url ? (
            <a
              className="source__title source__title--external"
              href={source.url}
              rel="noreferrer noopener"
              target="_blank"
              title={source.name}
            >
              {source.name}
            </a>
          ) : (
            <p className="source__title">{source.name}</p>
          )}

          {showOrganisation && source.organization && (
            <p>{source.organization}</p>
          )}

          {showReadme && (
            <p className="source__readme">
              {source.readme ? (
                <a
                  href={`${config.api}/${source.readme.replace(/^\/v2\//, '')}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Technical readme
                </a>
              ) : (
                'No technical readme for this source'
              )}
            </p>
          )}
        </li>
      ))}
    </Container>
  );
}

SourcesList.propTypes = {
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      sourceURL: PropTypes.string,
      url: PropTypes.string,
    }).isRequired
  ).isRequired,
  showReadme: PropTypes.bool,
  showOrganisation: PropTypes.bool,
};
