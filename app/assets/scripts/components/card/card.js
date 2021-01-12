import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';

import CardTag from './card-tag';
import InfoButton from '../info-button';

const CardWrapper = styled.article`
  ${({ gridColumn, gridRow }) => css`
    grid-column: ${gridColumn || 'auto'};
    grid-row: ${gridRow || 'auto'};
  `}
`;

const CardContents = styled.div``;

export const CardHeader = styled.header``;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Test = styled.div``;

const CardFooter = styled.footer``;

export const CardHeadline = styled.div`
  display: flex;
  gap: 1.5rem;
`;

export const CardTitle = styled.h1`
  width: fit-content;
`;

export const CardSubtitle = styled.p``;
export const HighlightText = styled.h1`
  font-size: ${({ size }) => {
    switch (size) {
      case 'small':
        return '1rem';
      case 'medium':
        return '2rem';
      case 'large':
        return '3rem';
      default:
        return '1rem';
    }
  }};
`;

const TagWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min-content, 2rem));
  grid-gap: 0.5rem;
`;

/*
 * Generic Card component for dashboard pages
 */
export default function Card({
  id,
  gridColumn,
  gridRow,
  title,
  subtitle,
  tags,
  renderHeader,
  renderBody,
  renderFooter,
  noBodyStyle,
  titleInfo,
}) {
  return (
    <CardWrapper
      data-cy={`${id}-card`}
      className="card"
      gridColumn={gridColumn}
      gridRow={gridRow}
    >
      <CardContents className="card__contents">
        {renderHeader ? (
          renderHeader()
        ) : (
          <CardHeader className="card__header">
            {subtitle && (
              <CardSubtitle className="card__subtitle">{subtitle}</CardSubtitle>
            )}
            <CardHeadline className="card__headline">
              <CardHeadline>
                {title && (
                  <CardTitle
                    data-cy={`${id}-card-title`}
                    className="card__title"
                  >
                    {title}
                  </CardTitle>
                )}
                {titleInfo && <InfoButton info={titleInfo} id={`${id}`} />}
              </CardHeadline>
            </CardHeadline>
            {tags && (
              <TagWrapper>
                {typeof tags === 'string' ? (
                  <CardTag label={tags} />
                ) : (
                  tags
                    .filter(tag => tag)
                    .map((tag, i) => <CardTag key={i} label={tag} />)
                )}
              </TagWrapper>
            )}
          </CardHeader>
        )}
        <CardBody className={noBodyStyle ? '' : 'card__body'}>
          {renderBody && renderBody()}
        </CardBody>
        {renderFooter && (
          <CardFooter className="card__footer">{renderFooter()}</CardFooter>
        )}
      </CardContents>
    </CardWrapper>
  );
}

Card.propTypes = {
  id: T.string,
  titleInfo: T.string,
  gridColumn: T.string,
  gridRow: T.string,
  title: T.oneOfType([T.string, T.element]),
  subtitle: T.oneOfType([T.string, T.element]),
  tags: T.oneOfType([T.string, T.arrayOf(T.string)]),
  renderHeader: T.func,
  renderBody: T.func,
  renderFooter: T.func,
  noBodyStyle: T.bool,
};
