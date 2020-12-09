import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import SmartLink from '../smart-link';
import Card from '../card';

const SourceList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const InfoMessage = styled.div`
  box-shadow: 0 0 0 1px rgba(35, 47, 59, 0.08);
  border-radius: 0.25rem;
  text-align: center;
`;

const Source = styled(SmartLink)``;

export default function SourceInfo({ sources }) {
  const sourceArr = typeof sources === 'object' ? [sources] : sources;
  return (
    <Card
      title={sourceArr && sourceArr.length > 1 ? 'Sources' : 'Source'}
      gridColumn={'11 / -1'}
      renderBody={() => {
        if (sourceArr) {
          return (
            <SourceList>
              {sourceArr.map(source => (
                <Source
                  key={source.name}
                  to={source.sourceURL || source.url}
                  title={source.name}
                >
                  {source.name}
                </Source>
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
        sources && sources[0]
          ? () => (
              <div>
                For more information contact{' '}
                <SmartLink
                  to={`mailto:${sources[0].contacts[0]}`}
                  title={sources[0].contacts[0]}
                >
                  {sources[0].contacts[0]}
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
  sources: T.oneOfType([
    T.arrayOf(
      T.shape({
        name: T.string,
        sourceURL: T.string,
        url: T.string,
        contacts: T.array,
      })
    ),
    T.shape({
      name: T.string,
      sourceURL: T.string,
      url: T.string,
      contacts: T.array,
    }),
  ]),
};
