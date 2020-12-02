import * as React from 'react';
import './datatable.css';

function DataTable(props) {
  const {headers, data} = props;
  let keyField = props.keyField || "id";
  let noData = props.noData || "No records found!";
  let width = props.width || "100%";


  const renderTableHeader = () => {
    // Sort header according to index
    headers.sort((a, b) => {
      if (a.index > b.index) return 1;
      return -1;
    });

    let headerView = headers.map((header, index) => {
      let title = header.title;
      let cleanTitle = header.accessor;
      let width = header.width;

      return (
        <th key={cleanTitle} 
          style={{width: width}}
          data-col = {cleanTitle}
        >
          <span className="header-cell">
            {title}
          </span>
        </th>
      )
    });

    return headerView;
  }

  const renderContent = () => {
    let contentView = data.map((row, rowIdx) => {
      let id = row[keyField];
      let tds = headers.map((header, index) => {
        let content = row[header.accessor];
        let cell = header.cell;
        if (cell) {
          if (typeof(cell) === "object") {
            if (cell.type === "image" && content) {
              content = <img alt={cell.alt || "image"} style={cell.style} src={content} />
            }
          } else if (typeof(cell) === "function") {
            content = cell(row);
          }
        }
        return (
          <td key={index} data-id={id} data-row={rowIdx}>
            {content}
          </td>
        )
      });
       return (
        <tr key={id || rowIdx}>
          {tds}
        </tr>
       );
    });
    return contentView;
  }

  const renderNoData = () => {
    return (
      <tr>
        <td colSpan={headers.length}>
            {noData}
        </td>
      </tr>
    );
  }

  const renderTable = () => {
    let title = props.title || "DataTable";
    let headerView = renderTableHeader();
    let contentView = data.length > 0 
            ? renderContent() : renderNoData();

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">
          {title}
        </caption>
        <thead>
          <tr>
            {headerView}
          </tr>
        </thead>
        <tbody>
          {contentView}
        </tbody>
      </table>
    )
  }

  return (
    <div className={props.className}>
      {renderTable()}
    </div>
  )
}

export default DataTable;