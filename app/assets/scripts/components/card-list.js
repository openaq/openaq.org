import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  ${({ gridGap, gridTemplateRows, gridTemplateColumns }) => css`
    grid-template-columns: ${gridTemplateColumns || 'repeat(4, 1fr)'};
    grid-template-rows: ${gridTemplateRows || 'auto'};
    grid-gap: ${gridGap || '2rem'};
  `}
`;

function CardList (props) {
  const {
    gridGap,
    gridTemplateColumns,
    gridTemplateRows,
    className
  } = props;
  return (
    <Wrapper
      className={className}
      {...{
        gridGap,
        gridTemplateColumns,
        gridTemplateRows,
      }}
    >
      {props.children}
    </Wrapper>
  );
}

CardList.propTypes = {
  gridGap: T.string,
  gridTemplateRows: T.string,
  gridTemplateColumns: T.string,
  className: T.string,
  children: T.node,
};

export default CardList;
