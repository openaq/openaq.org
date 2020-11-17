import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';

const CardWrapper = styled.article`
  ${({ gridColumn, gridRow }) => css`
    grid-column: ${gridColumn || 'auto'};
    grid-row: ${gridRow || 'auto'};
  `}
`;

const CardContents = styled.a``;

const CardHeader = styled.header``;

export const CardBody = styled.div``;
export const Test = styled.div``;

const CardFooter = styled.footer``;

const CardHeadline = styled.div``;

const CardTitle = styled.h1``;

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
/* Generic Card component for dashboard pages
 */

function Card(props) {
  const {
    gridColumn,
    gridRow,
    title,
    subtitle,
    renderHeader,
    renderBody,
    renderFooter,
  } = props;
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
          </CardHeader>
        )}
        {renderBody ? (
          renderBody()
        ) : (
          <CardBody className="card__body">Body</CardBody>
        )}
        {renderFooter ? (
          renderFooter()
        ) : (
          <CardFooter className="card__footer">Footer</CardFooter>
        )}
      </CardContents>
    </CardWrapper>
  );
}

Card.propTypes = {
  gridColumn: T.string,
  gridRow: T.string,
  title: T.string,
  subtitle: T.string,
  renderBody: T.func,
  renderHeader: T.func,
  renderFooter: T.func,
};

export default Card;
