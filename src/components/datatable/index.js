import * as React from 'react';
import ReactDOM from 'react-dom';

import './datatable.css';

function DataTable(props) {
  const [state, setData] = React.useState({
    sortby: null,
    descending: null,
    data: props.data
  });

  const {headers} = props;
  
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

      if (state.sortby === index) {
        title += state.descending ? '\u2193' : '\u2191';
      }

      return (
        <th key={cleanTitle} 
          style={{width: width}}
          data-col = {cleanTitle}
        >
          <span className="header-cell" data-col = {cleanTitle}>
            {title}
          </span>
        </th>
      )
    });

    return headerView;
  }

  const renderContent = () => {
    let contentView = state.data.map((row, rowIdx) => {
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

    // Sort function
  const onSort = (e) => {
    let dataCopy = [...state.data];
    // Get col index
    let colIndex = ReactDOM.findDOMNode(e.target).parentNode.cellIndex;
    
    let colTitle = e.target.dataset.col;

    //alert(colTitle);

    let descending = !state.descending;
    dataCopy.sort((a, b) => {
      let sortVal  = 0;
      if (a[colTitle] < b[colTitle]) {
        sortVal = -1; // asc
      } else if(a[colTitle] > b[colTitle]) {
        // desc
        sortVal = 1;
      }
      if (descending) {
        sortVal = sortVal * -1;
      }
      return sortVal;
    });

    setData({
      sortby: colIndex,
      descending,
      data: dataCopy
    });
  }

  const renderTable = () => {
    let title = props.title || "DataTable";
    let headerView = renderTableHeader();
    let contentView = state.data.length > 0 
            ? renderContent() : renderNoData();

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">
          {title}
        </caption>
        <thead onClick={onSort}>
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