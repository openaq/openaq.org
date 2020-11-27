import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';

import CardTag from './card-tag';

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

const CardHeadline = styled.div``;

export const CardTitle = styled.h1``;

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

/*
 * Generic Card component for dashboard pages
 */
export default function Card({
  gridColumn,
  gridRow,
  title,
  subtitle,
  tags,
  renderHeader,
  renderBody,
  renderFooter,
  noBodyStyle,
}) {
  return (
    <CardWrapper className="card" gridColumn={gridColumn} gridRow={gridRow}>
      <CardContents className="card__contents">
        {renderHeader ? (
          renderHeader()
        ) : (
          <CardHeader className="card__header">
            <CardHeadline className="card__headline">
              {subtitle && (
                <CardSubtitle className="card__subtitle">
                  {subtitle}
                </CardSubtitle>
              )}
              {title && <CardTitle className="card__title">{title}</CardTitle>}
            </CardHeadline>

            {tags && typeof tags === 'string' ? (
              <CardTag label={tags} />
            ) : (
              tags && tags.map((tag, i) => <CardTag key={i} label={tag} />)
            )}
          </CardHeader>
        )}
        <CardBody className={noBodyStyle ? '' : 'card__body'}>
          {renderBody && renderBody()}
        </CardBody>
        <CardFooter className="card__footer">
          {renderFooter && renderFooter()}
        </CardFooter>
      </CardContents>
    </CardWrapper>
  );
}

Card.propTypes = {
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
