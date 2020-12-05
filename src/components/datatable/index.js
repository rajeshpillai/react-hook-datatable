import * as React from "react";
import ReactDOM from "react-dom";

import "./datatable.css";
import Pagination from "../pagination";

function DataTable(props) {
  const [state, setData] = React.useState({
    sortby: props.sortCol || null,
    descending:
      (props.sortOrder ? props.sortOrder.toLowerCase() == "desc" : false) ||
      null,
    data: props.data,
    pagedData: props.data,
    headers: props.headers,
    // pageLength: props.pagination.pageLength || 5,
    currentPage: 1,
  });

  let keyField = props.keyField || "id";
  let noData = props.noData || "No records found!";
  let width = props.width || "100%";
  let pagination = props.pagination;

  // Update local state, when the parent changes the props of DataTable
  React.useEffect(() => {
    setData({
      ...state,
      data: props.data,
      // pagination: props.pagination,
      // pageLength: props.pagination.pageLength,
    });
  }, [props.data]);

  // // Update local state, when the parent changes the props of DataTable
  React.useEffect(() => {
    setData({
      ...state,
      sortby: props.sortCol || null,
      descending:
        (props.sortOrder ? props.sortOrder.toLowerCase() == "desc" : false) ||
        null,
    });
  }, [props.sortCol, props.sortOrder]);

  // For pagnation to load data from serverside
  React.useEffect(() => {
    if (props.pagination && props.pagination.enabled) {
      // onGotoPage(1);
      setData({
        ...state,
        pagedData:
          pagination.enabled && pagination.serverSide
            ? state.data
            : getPagedData(1, pagination.pageLength),
      });
    }
  }, [state.data]);

  // For Sorting
  React.useEffect(() => {
    onGotoPage(state.currentPage);
  }, [state.descending, state.sortby]);

  // For pagination
  React.useEffect(() => {
    console.log("props", props);
    if (pagination.enabled) {
      if (props.pagination.serverSide) {
        //serverSide
      } else {
        //NOT server side
        onGotoPage(state.currentPage);
      }
      // let pages = Math.ceil(state.data.length / state.pageLength);
      // let currentPage = state.currentPage > pages - 1 ? 1 : state.currentPage;
    }
  }, [props.pagination.pageLength]);

  // Col drag and drop events
  const onDragStart = (e, srcIndex) => {
    e.dataTransfer.setData("text/plain", srcIndex);
  };

  const onDrop = (e, targetIndex) => {
    e.preventDefault();
    let source = e.dataTransfer.getData("text/plain");
    let headers = [...state.headers]; // clone the header
    let srcHeader = headers[source];
    let targetHeader = headers[targetIndex];

    let temp = srcHeader.index;
    srcHeader.index = targetHeader.index;
    targetHeader.index = temp;

    setData({
      ...state,
      data: [...state.data],
      headers: state.headers,
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const renderTableHeader = () => {
    // Sort header according to index
    state.headers.sort((a, b) => {
      if (a.index > b.index) return 1;
      return -1;
    });

    let headerView = state.headers.map((header, index) => {
      let title = header.title;
      let cleanTitle = header.accessor;
      let width = header.width;

      if (state.sortby === cleanTitle) {
        title += state.descending ? "\u2193" : "\u2191";
      }

      return (
        <th
          key={cleanTitle}
          style={{ width: width }}
          data-col={cleanTitle}
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, index)}
        >
          <span draggable className="header-cell" data-col={cleanTitle}>
            {title}
          </span>
        </th>
      );
    });

    return headerView;
  };

  const renderContent = () => {
    let data = state.pagedData; //pagination.enabled ? state.pagedData : state.data;

    let contentView = data.map((row, rowIdx) => {
      let id = row[keyField];
      let tds = state.headers.map((header, index) => {
        let content = row[header.accessor];
        let cell = header.cell;
        if (cell) {
          if (typeof cell === "object") {
            if (cell.type === "image" && content) {
              content = (
                <img
                  alt={cell.alt || "image"}
                  style={cell.style}
                  src={content}
                />
              );
            }
          } else if (typeof cell === "function") {
            content = cell(row);
          }
        }
        return (
          <td key={index} data-id={id} data-row={rowIdx}>
            {content}
          </td>
        );
      });
      return <tr key={id || rowIdx}>{tds}</tr>;
    });
    return contentView;
  };

  const renderNoData = () => {
    return (
      <tr>
        <td colSpan={state.headers.length}>{noData}</td>
      </tr>
    );
  };

  // Sort function
  const onSort = (e) => {
    let colTitle = e.target.dataset.col;
    if (pagination.serverSide) {
      //Server side
      props.onSort &&
        props.onSort(colTitle, !state.descending ? "desc" : "asc");
      setData({
        ...state,
        descending: !state.descending,
        currentPage: 1,
        sortby: colTitle,
      });
    } else {
      let dataCopy = [...state.data];
      // Get col index
      let colIndex = ReactDOM.findDOMNode(e.target).parentNode.cellIndex;

      //alert(colTitle);

      let descending = !state.descending;
      dataCopy.sort((a, b) => {
        let sortVal = 0;
        if (a[colTitle] < b[colTitle]) {
          sortVal = -1; // asc
        } else if (a[colTitle] > b[colTitle]) {
          // desc
          sortVal = 1;
        }
        if (descending) {
          sortVal = sortVal * -1;
        }
        return sortVal;
      });

      setData({
        ...state,
        sortby: colIndex,
        descending,
        data: dataCopy,
        // pagedData: getPagedData(state.currentPage,state.pageLength),
        headers: [...state.headers],
      });
    }
  };

  const renderTable = () => {
    let title = props.title || "DataTable";
    let headerView = renderTableHeader();
    let contentView =
      state.pagedData.length > 0 ? renderContent() : renderNoData();

    return (
      <table className="data-inner-table">
        <caption className="data-table-caption">{title}</caption>
        <thead onClick={onSort}>
          <tr>{headerView}</tr>
        </thead>
        <tbody>{contentView}</tbody>
      </table>
    );
  };

  const onPageLengthChange = async (pageLength) => {
    pageLength = parseInt(pageLength, 10);
    let pages =
      Math.ceil(props.totalRecords / pageLength) ||
      Math.ceil(state.data.length / pageLength);
    let currentPage = state.currentPage > pages - 1 ? 1 : state.currentPage;
    if (props.pagination.serverSide) {
      //Server side
      // let pagedData = await props.onChangePage(currentPage);
      // setData({
      //   ...state,
      //   data: pagedData,
      //   pagedData: pagedData,
      //   pageLength: parseInt(pageLength, 10),
      //   currentPage,
      // });
      setData({
        ...state,
        currentPage: 1,
        //pageLength: parseInt(pageLength, 10),
      });
      props.onPageLengthChange && props.onPageLengthChange(pageLength);
    } else {
      setData({
        ...state,
        // pageLength: parseInt(pageLength, 10),
        currentPage,
      });
      props.onPageLengthChange && props.onPageLengthChange(pageLength);
    }
  };

  const getPagedData = (pageNo, pageLength) => {
    let startOfRecord = (pageNo - 1) * pageLength;
    let endOfRecord = startOfRecord + pageLength;

    let data = state.data;
    let pagedData = data.slice(startOfRecord, endOfRecord);

    return pagedData;
  };

  const onGotoPage = async (pageNo) => {
    if (props.pagination.serverSide) {
      let pagedData = state.data;
      if (pageNo != state.currentPage) {
        pagedData = await props.onChangePage(pageNo);
      }
      setData({
        ...state,
        pagedData: pagedData,
        data: pagedData,
        currentPage: pageNo,
      });
    } else {
      let pagedData = getPagedData(pageNo, props.pagination.pageLength);
      setData({
        ...state,
        pagedData: pagedData,
        currentPage: pageNo,
      });
    }
  };

  return (
    <div className={props.className}>
      {pagination.enabled && (
        <Pagination
          type={pagination.type}
          totalRecords={
            props.totalRecords || (state.data && state.data.length) || 0
          }
          pageLength={props.pagination.pageLength}
          onPageLengthChange={onPageLengthChange}
          onGotoPage={onGotoPage}
          currentPage={state.currentPage}
        >
          {" "}
        </Pagination>
      )}
      {renderTable()}
    </div>
  );
}

export default DataTable;
