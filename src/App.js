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
        dataType: "string",
      },
    ],
    pageLength: 10,
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
      `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${state.pageLength}`
    );
    let data = await resp.json();

    return data;
  };

  // // For pagination
  React.useEffect(() => {
    //if (pagination.enabled && !props.pagination.serverSide) {
    fetchData();
    //}
  }, [state.pageLength]);

  const onPageLengthChange = (pageLength) => {
    setState({
      ...state,
      pageLength,
    });
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
          pageLength: state.pageLength,
          type: "long", // long, short
          serverSide: true,
        }}
        width="100%"
        headers={state.headers}
        data={state.data}
        totalRecords={200}
        noData="No records!"
        onUpdate={onUpdateTable}
        onChangePage={fetchDataOnly}
        onPageLengthChange={onPageLengthChange}
      />
    </div>
  );
}

export default App;
