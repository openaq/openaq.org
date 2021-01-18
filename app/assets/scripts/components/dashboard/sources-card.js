import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import SmartLink from '../smart-link';
import Card from '../card';
import config from '../../config';

const SourceList = styled.ul`
  padding: 0;
  list-style: none;

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const InfoMessage = styled.div`
  box-shadow: 0 0 0 1px rgba(35, 47, 59, 0.08);
  border-radius: 0.25rem;
  text-align: center;
`;

export default function SourceInfo({ sources }) {
  return (
    <Card
      title={sources && sources.length > 1 ? 'Sources' : 'Source'}
      id="sources"
      className="card--sources"
      renderBody={() => {
        if (sources) {
          return (
            <SourceList>
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
                    <p className="source__title" title={source.name}>
                      {source.name}
                    </p>
                  )}
                  <p className="source__readme">
                    {source.readme ? (
                      <a
                        href={`${config.api}/${source.readme.replace(
                          /^\/v2\//,
                          ''
                        )}`}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        Technical readme
                      </a>
                    ) : (
                      'No technical readme for this source'
                    )}
                  </p>
                </li>
              ))}
            </SourceList>
          );
        }
        return (
          <InfoMessage>
            <p>There are no sources listed.</p>
            <p>
              Maybe you&apos;d like to suggest a{' '}
              <SmartLink
                to="https://docs.google.com/forms/d/1Osi0hQN1-2aq8VGrAR337eYvwLCO5VhCa3nC_IK2_No/viewform"
                title="Suggest a new source"
              >
                new source
              </SmartLink>
              .
            </p>
          </InfoMessage>
        );
      }}
      renderFooter={
        sources && sources.length
          ? () => (
              <div className="sources__info">
                For more information contact{' '}
                <SmartLink
                  to="mailto:info@openaq.org"
                  title="Send email to openaq"
                >
                  info@openaq.org
                </SmartLink>
                .
              </div>
            )
          : null
      }
    />
  );
}

SourceInfo.propTypes = {
  sources: T.arrayOf(
    T.shape({
      name: T.string,
      sourceURL: T.string,
      url: T.string,
      contacts: T.array,
    })
  ),
};
