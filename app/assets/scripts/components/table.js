import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import T from 'prop-types';

/*
 * Table component
 * @param data - data object used to construct table
 *    expected in the following format:
 *    {
 *      header1: {
 *        values: [Array](required),
 *        formatCell: [function](optional),
 *        formatHeader: [function])(optional),
 *        sortable: [boolean](optional, default false),
 *        cellWidth: [string](optional)
 *      },
 *      ...,
 *      headerN: {
 *        values: [Array](required),
 *        formatCell: [function](optional),
 *        formatHeader: [function])(optional),
 *        sortable: [boolean](optional, default false),
 *        cellWidth: [string](optional)
 *      }
 *    }
 */
const Table = styled.table``;
const Row = styled.tr`
  background-color: ${({ index }) => (index % 2 === 0 ? '#ffffff' : '#f4f9fe')};
  ${({ header }) =>
    header &&
    css`
      background-color: #f8f8f8;
    `}
  th:first-child {
    border-left: none;
  }
  th:last-child {
    border-right: none;
  }
`;
const Header = styled.th`
  max-width: 5rem;
  padding: 0.75rem 1rem;
  text-align: center;
  border-left: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
  border-collapse: collapse;
  font-weight: 500;
  font-size: 0.7rem;
  ${({ active }) =>
    active &&
    css`
      font-weight: 900;
    `}

  &:hover {
    transform: scale(1.05);
  }
`;
const Cell = styled.td`
  padding: 0.75rem 1.5rem;

  ${({ style }) =>
    style &&
    css`
      ${Object.entries(style)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    `}
`;

const prepareRows = data => {
  const numVals = Math.max(
    ...Object.values(data).map(datum => datum.values.length)
  );
  const rows = [];
  for (let i = 0; i < numVals; i++) {
    rows.push(
      Object.entries(data).map(([key, column]) => {
        return {
          header: key,
          value: column.values[i],
          formatCell: column.formatCell,
          style: column.style,
        };
      })
    );
  }
  return rows;
};
function TableComponent(props) {
  const { data } = props;
  const [activeHeader, setActiveHeader] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  return (
    <Table className="global-table">
      <thead>
        <Row header>
          {Object.entries(data).map(([key, datum]) => {
            const { formatHeader } = datum;
            return (
              <Header
                className={`sort_${sortAsc ? 'asc' : 'desc'}`}
                key={key}
                active={key === activeHeader}
                onClick={() => {
                  setActiveHeader(key);
                  setSortAsc(!sortAsc);
                }}
              >
                {formatHeader ? formatHeader(key) : key}
              </Header>
            );
          })}
        </Row>
      </thead>
      <tbody>
        {prepareRows(data)
          .sort((rowA, rowB) => {
            if (!activeHeader) {
              return 0;
            }
            const valA = rowA.find(el => el.header === activeHeader).value;
            const valB = rowB.find(el => el.header === activeHeader).value;

            const dir = sortAsc ? 1 : -1;

            if (valA > valB) {
              return 1 * dir;
            } else if (valA < valB) {
              return -1 * dir;
            } else {
              return 0;
            }
          })
          .map((row, i) => {
            return (
              <Row key={`row-${i}`} index={i}>
                {row.map(cell => {
                  return (
                    <Cell
                      style={cell.style}
                      key={`${cell.header}-${cell.value}`}
                    >
                      {cell.formatCell
                        ? cell.formatCell(cell.value)
                        : cell.value}
                    </Cell>
                  );
                })}
              </Row>
            );
          })}
      </tbody>
    </Table>
  );
}

TableComponent.propTypes = {
  data: T.object,
};

export default TableComponent;
