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

  const renderTable = () => {
    let title = props.title || "DataTable";
    let headerView = renderTableHeader();
    let contentView = "Content goes here...";

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