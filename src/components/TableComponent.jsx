import React from "react";

const TableComponent = ({ columns, rows }) => (
  <div className="table-wrap">
    <table className="table-base">
      <thead>
        <tr>{columns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id || i}>
            {columns.map((col) => <td key={col.key}>{row[col.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableComponent;
