import React from 'react';
import c from 'classnames';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import CardTag from './card-tag';
import InfoButton from '../info-button';

const CardContents = styled.div``;

export const CardHeader = styled.header``;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
`;

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
  margin: 0.5rem 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

/*
 * Generic Card component for dashboard pages
 */
export default function Card({
  id,
  className,
  isDashboardHeader,
  promoteZIndex,
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
    <article
      style={promoteZIndex && { zIndex: `1003` }} // needed if tooltip is used in card and spills onto neighboring card. Consecutive card will cover tooltip without this.
      data-cy={`${id}-card`}
      className={c('card', className)}
    >
      <CardContents
        className={`card__contents ${isDashboardHeader && 'card__grey'}`}
      >
        {renderHeader ? (
          renderHeader()
        ) : (
          <CardHeader className="card__header">
            {subtitle && (
              <CardSubtitle className="card__subtitle">{subtitle}</CardSubtitle>
            )}
            <CardHeadline className="card__headline">
              {title && (
                <CardTitle data-cy={`${id}-card-title`} className="card__title">
                  {title}
                </CardTitle>
              )}
              {titleInfo && <InfoButton info={titleInfo} id={`${id}`} />}
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
    </article>
  );
}

Card.propTypes = {
  id: T.string,
  isDashboardHeader: T.bool,
  promoteZIndex: T.bool,
  titleInfo: T.string,
  className: T.string,
  title: T.oneOfType([T.string, T.element]),
  subtitle: T.oneOfType([T.string, T.element]),
  tags: T.oneOfType([T.string, T.arrayOf(T.string)]),
  renderHeader: T.func,
  renderBody: T.func,
  renderFooter: T.func,
  noBodyStyle: T.bool,
};
