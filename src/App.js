import React, { useEffect } from "react";
import "./App.css";
import DataTable from "./components/datatable";
function App() {
  let setup = {
    headers: [
      { title: "Id", accessor: "id", index: 1, dataType: "number" },
      {
        title: "Title",
        accessor: "title",
        width: "300px",
        index: 2,
        dataType: "string",
      },
      {
        title: "Completed",
        accessor: "completed",
        index: 3,
        dataType: "boolean",
      },
    ],
    pageLength: 10,
    sort: {
      sortCol: "id",
      sortOrder: "Asc",
    },
    data: [
      {
        userId: 1,
        id: 2,
        title: "quis ut nam facilis et officia qui",
        completed: false,
      },
      {
        userId: 1,
        id: 3,
        title: "fugiat veniam minus",
        completed: false,
      },
      {
        userId: 1,
        id: 4,
        title: "et porro tempora",
        completed: true,
      },
    ],
  };

  const [state, setState] = React.useState(setup);

  useEffect(() => {
    fetchData(0, state.pageLength);
  }, []);

  const fetchData = async (start, limit) => {
    let data = await fetchDataOnly(1);

    setState({
      ...state,
      data,
    });
  };

  // const fetchDataOnly = async (start, limit) => {
  //   let resp = await fetch(
  //     `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${limit}`
  //   );
  //   let data = await resp.json();

  //   return data;
  // };

  const fetchDataOnly = async (pageNo) => {
    pageNo = parseInt(pageNo);
    let start = state.pageLength * (pageNo - 1);

    let resp = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${state.pageLength}&_sort=${state.sort.sortCol}&_order=${state.sort.sortOrder}`
    );
    let data = await resp.json();

    return data;
  };

  // // For pagination
  React.useEffect(() => {
    //if (pagination.enabled && !props.pagination.serverSide) {
    fetchData();
    //}
  }, [state.pageLength, state.sort]);

  const onPageLengthChange = (pageLength) => {
    setState({
      ...state,
      pageLength,
    });
  };

  const onSort = (col, order) => {
    console.log(col, order);
    setState({
      ...state,
      sort: {
        ...state.sort,
        sortCol: col,
        sortOrder: order,
      },
    });
    // fetchData();
  };

  const onUpdateTable = () => {};

  const onAddRow = () => {
    let id = +new Date();
    var newRow = {
      id: id,
      name: "name " + id,
      age: 34,
      qualification: "Graduate",
      rating: 4,
      profile:
        "https://assets.dryicons.com/uploads/icon/svg/5578/a929b5f4-ccd8-43d9-b2bc-bc735aaa8617.svg",
    };

    setState({
      ...state,
      data: [newRow, ...state.data],
    });
  };

  return (
    <div className="App">
      <button onClick={onAddRow}>Add random row</button>
      <DataTable
        className="data-table"
        title="USER PROFILES"
        keyField="id"
        edit={true}
        pagination={{
          enabled: true,
          pageLength: state.pageLength, //for server side keep in state
          type: "long", // long, short
          serverSide: true,
        }}
        width="100%"
        headers={state.headers}
        data={state.data}
        totalRecords={200}
        noData="No records!"
        onUpdate={onUpdateTable}
        onChangePage={fetchDataOnly} //for server side
        onPageLengthChange={onPageLengthChange}
        onSort={onSort}
        sortCol={state.sort.sortCol}
        sortOrder={state.sort.sortOrder}
      />
    </div>
  );
}

export default App;
