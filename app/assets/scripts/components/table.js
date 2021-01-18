import React, { useState } from 'react';
import T from 'prop-types';
import c from 'classnames';
import _ from 'lodash';

/**
 * Table component
 * @param headers - table headers expected in the following format:
 *    [
 *      {
 *        id: [String](required) // header1
 *        formatCell: [function](optional),
 *        formatHeader: [function])(optional),
 *        sortable: [boolean](optional, default false),
 *      },
 *      ...,
 *      {
 *        id: [String](required) // headerN
 *        formatCell: [function](optional),
 *        formatHeader: [function])(optional),
 *        sortable: [boolean](optional, default false),
 *      }
 *    ]
 * @param rows - Data for the table body. If the header formatCell functions are
 * not used it must have the value under the header id.
 *   [
 *    {
 *     header1: something
 *     headerN: something-else
 *    }
 *   ]
 */
function TableComponent(props) {
  const { headers, rows } = props;
  const [activeHeader, setActiveHeader] = useState(headers[0].id);
  const [sortAsc, setSortAsc] = useState(true);

  const sortedRows = _(rows)
    .sortBy(activeHeader)
    .tap(array => {
      if (!sortAsc) _.reverse(array);
    })
    .value();

  return (
    <table className="table table--zebra">
      <thead>
        <tr>
          {headers.map((header, idx) => {
            const { sortable, id, formatHeader, value } = header;
            const headerValue =
              typeof formatHeader === 'function'
                ? formatHeader(header, idx)
                : value;

            if (sortable) {
              const onClick = e => {
                e.preventDefault();
                if (activeHeader === id) {
                  setSortAsc(v => !v);
                } else {
                  setActiveHeader(id);
                  setSortAsc(true);
                }
              };
              const classes = c('table__sort', {
                'table__sort--none': activeHeader !== id,
                'table__sort--asc': activeHeader === id && sortAsc,
                'table__sort--desc': activeHeader === id && !sortAsc,
              });

              return (
                <th key={id}>
                  <a
                    className={classes}
                    href="#"
                    title="Sort table by field"
                    onClick={onClick}
                  >
                    {headerValue}
                  </a>
                </th>
              );
            } else {
              return <th key={id}>{headerValue}</th>;
            }
          })}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, idx) => {
          return (
            <tr key={`sort-${activeHeader}-${sortAsc}-${idx}`}>
              {headers.map(header => {
                const { id, formatCell } = header;

                const cellValue =
                  typeof formatCell === 'function'
                    ? formatCell(row[id], row, header)
                    : row[id];

                return <td key={id}>{cellValue}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

TableComponent.propTypes = {
  headers: T.array,
  rows: T.array,
};

export default TableComponent;
