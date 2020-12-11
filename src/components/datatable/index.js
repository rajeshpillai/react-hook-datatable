import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./datatable.css";
import Pagination from "../pagination";

function DataTable(props) {
  const defaultPagination = {
    enabled: false,
    pageLength: 0,
    type: "long",
    startQueryKey: "offset",
    limitQueryKey: "limit",
  };
  const defaultSort = { enabled: false };

  let isSortEnabled = (props.sort && props.sort.enabled) || false;
  let isEditable = props.edit || false;
  let getTotalRecords = () => {
    if (!props.serverSideDataLoad && props.data) {
      return props.data.length;
    }
    return 0;
  };
  let isPaginationEnabled =
    (props.pagination ? props.pagination.enabled : false) || false;

  let isServerSide = props.serverSideDataLoad || false;

  let keyField = props.keyField || "id";
  let noData = props.noData || "No records found!";
  let width = props.width || "100%";

  const [state, setData] = useState({
    sortby: (isSortEnabled && props.sort.sortCol) || null,
    descending:
      (isSortEnabled && props.sort
        ? props.sort.sortOrder.toLowerCase() == "desc"
        : false) || null,
    data: props.data || [],
    pagedData: props.data || [],
    headers: props.headers,
    totalRecords: getTotalRecords(),
    currentPage: 1,
    pagination: isPaginationEnabled
      ? { ...defaultPagination, ...props.pagination }
      : defaultPagination,
    sort: isSortEnabled
      ? props.sort
        ? { ...defaultSort, ...props.sort }
        : defaultSort
      : defaultSort,
  });

  // For first time load, pagination and Sorting
  useEffect(() => {
    onGotoPage(1);
  }, [state.sort.sortCol, state.sort.sortOrder, state.pagination.pageLength]);

  const fetchDataOnly = async (pageNo) => {
    pageNo = parseInt(pageNo);
    let start = state.pagination.pageLength * (pageNo - 1);
    if (!props.server || (props.server && !props.server.data)) {
      throw new Error("Please provide Server side api url for data");
    }
    // let resp = await fetch(
    //   `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${state.pageLength}&_sort=${state.sort.sortCol}&_order=${state.sort.sortOrder}`
    // );
    let apiUrl = `${props.server.data.endpoint}`;
    let dataKey = props.server.data.dataKey;
    let totalRecordsKey = props.server.data.totalRecordsKey;

    //If pagination enabled then set start and limit in API URL
    if (isPaginationEnabled) {
      apiUrl += `?${state.pagination.startQueryKey}=${start}&${state.pagination.limitQueryKey}=${state.pagination.pageLength}`;
    }
    //If sorting is enabled then set sort column and sort order in API URL
    if (isSortEnabled) {
      apiUrl += `&sort=${state.sortby}&order=${state.sort.sortOrder}`;
    }
    //Fetch data using api
    let resp = await fetch(apiUrl);
    let data = await resp.json();
    let datatableData = isServerSide && dataKey ? data[dataKey] : data;
    let totalRecords = data.length;

    //If total records are also coming with same api URL result then read it using totalRecordsKey specified
    if (totalRecordsKey) {
      totalRecords = data[totalRecordsKey];
    }
    //Fetch Total number of records if enpoint url set for it.
    if (props.server.countRecords && props.server.countRecords.endpoint) {
      let countResp = await fetch(props.server.countRecords.endpoint);
      let countData = await countResp.json();
      if (totalRecordsKey) {
        totalRecords = countData[totalRecordsKey];
      } else {
        totalRecords = countData;
      }
    }
    return { data: datatableData, totalRecords };
  };

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

  const onCellDataChange = (e, header, rowIdx, colIdx) => {
    let newValue = e.target.value;
    console.log("newValue", newValue);
    let data = [...state.data];
    data[rowIdx][header.accessor] =
      header.dataType == "boolean"
        ? JSON.parse(newValue.toLowerCase())
        : newValue;
    setData({
      ...state,
      data,
    });
  };

  const getCellContent = (header, value, rowIdx, colIdx) => {
    if (isEditable && header.controlType) {
      switch (header.controlType) {
        case "text":
          let controlType = header.controlType;
          if (header.dataType == "number" || header.dataType == "email") {
            controlType = header.dataType;
          }
          return (
            <input
              type={controlType}
              name={header.accessor}
              value={value}
              onChange={(e) => onCellDataChange(e, header, rowIdx, colIdx)}
            ></input>
          );
          break;
        case "textarea":
          return (
            <textarea
              name={header.accessor}
              onChange={(e) => onCellDataChange(e, header, rowIdx, colIdx)}
              value={value}
            ></textarea>
          );
          break;
        case "select":
          return (
            <select
              name={header.accessor}
              value={value}
              onChange={(e) => onCellDataChange(e, header, rowIdx, colIdx)}
            >
              {header.options.map((opt) => {
                return (
                  <option
                    key={"o" + opt.value}
                    // selected={value == opt.value}
                    value={opt.value}
                  >
                    {opt.text}
                  </option>
                );
              })}
            </select>
          );
          break;
        case "radio":
          return header.options.map((opt) => {
            return (
              <React.Fragment key={"o" + opt.value}>
                <input
                  // key={"o" + opt.value}
                  type="radio"
                  name={header.accessor + rowIdx}
                  value={opt.value}
                  checked={value == opt.value}
                  onChange={(e) => onCellDataChange(e, header, rowIdx, colIdx)}
                ></input>{" "}
                {opt.text}
              </React.Fragment>
            );
          });
          break;
      }
      // return (
      //   <input
      //     type={header.controlType}
      //     name={header.accessor}
      //     value={value}
      //     onChange={(e) => onCellDataChange(e, header, rowIdx, colIdx)}
      //   ></input>
      // );
    } else {
      return value;
    }
  };

  const renderContent = () => {
    let data = state.pagedData; //isPaginationEnabled ? state.pagedData : state.data;

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
            {getCellContent(header, content, rowIdx, index)}
          </td>
        );
      });
      return (
        <tr className="datatable-row" key={id || rowIdx}>
          {tds}
        </tr>
      );
    });
    return contentView;
  };

  const renderNoData = () => {
    return (
      <tr className="no-data">
        <td colSpan={state.headers.length}>{noData}</td>
      </tr>
    );
  };

  // Sort function
  const onSort = (e) => {
    if (!isSortEnabled) {
      return false;
    }
    let colTitle = e.target.dataset.col;
    let descending = !state.descending;
    if (isServerSide) {
      //Server side
      state.sort.onSort &&
        state.sort.onSort(colTitle, descending ? "desc" : "asc");
      setData({
        ...state,
        descending,
        currentPage: 1,
        sortby: colTitle,
        sort: {
          ...state.sort,
          sortCol: colTitle,
          sortOrder: descending ? "desc" : "asc",
        },
      });
    } else {
      let dataCopy = [...state.data];
      // Get col index
      let colIndex = ReactDOM.findDOMNode(e.target).parentNode.cellIndex;

      //alert(colTitle);

      // let descending = colSortOrder;
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
        // sortby: colIndex,
        sortby: colTitle,
        descending: descending,
        data: dataCopy,
        // pagedData: getPagedData(state.currentPage,state.pageLength),
        headers: [...state.headers],
      });
      props.onSort && props.onSort(colTitle, descending ? "desc" : "asc");
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
      Math.ceil(state.totalRecords / pageLength) ||
      Math.ceil(state.data.length / pageLength);
    let currentPage = state.currentPage > pages - 1 ? 1 : state.currentPage;
    if (isServerSide) {
      //Server side
      setData({
        ...state,
        pagination: {
          ...state.pagination,
          pageLength: parseInt(pageLength, 10),
        },

        currentPage: 1,
      });
    } else {
      setData({
        ...state,
        // pageLength: parseInt(pageLength, 10),
        currentPage,
      });
    }

    props.onPageLengthChange && onPageLengthChange(pageLength);
  };

  const getPagedData = (pageNo, pageLength) => {
    let startOfRecord = (pageNo - 1) * pageLength;
    let endOfRecord = startOfRecord + pageLength;

    let data = state.data;
    let pagedData = data.slice(startOfRecord, endOfRecord);

    return pagedData;
  };

  const onGotoPage = async (pageNo) => {
    if (isServerSide) {
      let pagedData = state.data;
      // if (pageNo != state.currentPage) {
      // pagedData = await state.pagination.onChangePage(pageNo);
      pagedData = await fetchDataOnly(pageNo);
      let totalRecords = pagedData.totalRecords;
      pagedData = pagedData.data;
      // }
      setData({
        ...state,
        pagedData: pagedData,
        data: pagedData,
        currentPage: pageNo,
        totalRecords: totalRecords,
      });
    } else {
      let pagedData = getPagedData(pageNo, state.pagination.pageLength);
      setData({
        ...state,
        pagedData: pagedData,
        currentPage: pageNo,
      });
    }
  };

  const onSubmit = () => {
    if (props.onUpdateData) {
      props.onUpdateData(state.data);
    }
  };

  return (
    <div className={props.className}>
      {isPaginationEnabled && (
        <Pagination
          type={state.pagination.type}
          totalRecords={state.totalRecords}
          pageLength={state.pagination.pageLength}
          onPageLengthChange={onPageLengthChange}
          onGotoPage={onGotoPage}
          currentPage={state.currentPage}
        >
          {" "}
        </Pagination>
      )}
      {renderTable()}
      <div>Total Records: {state.totalRecords}</div>
      {isEditable && (
        <div>
          <input type="button" value="Submit" onClick={onSubmit} />
        </div>
      )}
    </div>
  );
}

export default DataTable;
