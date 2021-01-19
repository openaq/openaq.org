import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import SmartLink from '../smart-link';
import Card from '../card';
import SourcesList from '../sources-list';

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
      isDashboardHeader
      className="card--sources"
      renderBody={() =>
        sources ? (
          <SourcesList sources={sources} showReadme />
        ) : (
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
        )
      }
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
