import React, { useEffect, useState } from "react";
import "./App.css";
import DataTable from "./components/datatable";
import DynamicForm from "./components/dynamic-form";
function Gvm() {
  let setup = {
    headers: [
      {
        title: "Title",
        accessor: "title",
        width: "300px",
        index: 1,
        dataType: "string",
        controlType: "textarea",
      },
      {
        title: "Slug",
        accessor: "slug",
        index: 2,
        dataType: "string",
        controlType: "textarea",
      },
      {
        title: "Body",
        accessor: "body",
        index: 3,
        dataType: "string",
        controlType: "textarea",
      },
      {
        title: "Favorited",
        accessor: "favorited",
        index: 5,
        dataType: "boolean",
        controlType: "radio",
        options: [
          { text: "No", value: false },
          { text: "Yes", value: true },
        ],
      },
    ],
    pageLength: 5,
    sort: {
      sortCol: "title",
      sortOrder: "Asc",
    },
    // data: [],
    data: [
      {
        id: 1,
        name: "a",
        age: 29,
        qualification: "B.Com",
        rating: 3,
        gender: "male",
        city: "Kerala",
        skills: ["reactjs", "angular", "vuejs"],
      },
      {
        id: 2,
        name: "b",
        age: 35,
        qualification: "B.Sc",
        rating: 5,
        gender: "female",
        city: "Mumbai",
        skills: ["reactjs", "angular"],
      },
      {
        id: 3,
        name: "c",
        age: 42,
        qualification: "B.E",
        rating: 3,
        gender: "female",
        city: "Bangalore",
        skills: ["reactjs"],
      },
    ],
    totalRecords: 0,
  };
  const DEFAULT_DATA = {
    data: [
      // {
      //   id: 1,
      //   name: "a",
      //   age: 29,
      //   qualification: "B.Com",
      //   rating: 3,
      //   gender: "male",
      //   city: "Kerala",
      //   skills: ["reactjs", "angular", "vuejs"],
      // },
      // {
      //   id: 2,
      //   name: "b",
      //   age: 35,
      //   qualification: "B.Sc",
      //   rating: 5,
      //   gender: "female",
      //   city: "Mumbai",
      //   skills: ["reactjs", "angular"],
      // },
      // {
      //   id: 3,
      //   name: "c",
      //   age: 42,
      //   qualification: "B.E",
      //   rating: 3,
      //   gender: "female",
      //   city: "Bangalore",
      //   skills: ["reactjs"],
      // },
    ],
    current: {},
  };

  const [state, setState] = useState(setup);

  useEffect(() => {
    // fetchData(0, state.pageLength);
  }, []);

  const fetchData = async (start, limit) => {
    // let data = await fetchDataOnly(1);
    // setState({
    //   ...state,
    //   data,
    //   totalRecords: data.articles_count,
    // });
  };

  const fetchDataOnly = async (pageNo) => {
    // pageNo = parseInt(pageNo);
    // let start = state.pageLength * (pageNo - 1);
    // // let resp = await fetch(
    // //   `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${state.pageLength}&_sort=${state.sort.sortCol}&_order=${state.sort.sortOrder}`
    // // );
    // let resp = await fetch(
    //   `https://algo-blog-api.herokuapp.com/api/articles?offset=${start}&limit=${state.pageLength}`
    //   //&_sort=${state.sort.sortCol}&_order=${state.sort.sortOrder
    // );
    // let data = await resp.json();
    // return data.articles;
  };

  // // For pagination
  // useEffect(() => {
  //   //if (pagination.enabled && !props.pagination.serverSide) {
  //   fetchData();
  //   //}
  // }, [state.pageLength, state.sort]);

  const onPageLengthChange = (pageLength) => {
    setState({
      ...state,
      pageLength,
    });
  };

  const onSort = (col, order) => {
    // console.log(col, order);
    // setState({
    //   ...state,
    //   sort: {
    //     ...state.sort,
    //     sortCol: col,
    //     sortOrder: order,
    //   },
    // });
  };

  const onUpdateTable = () => {};

  const onUpdateData = (data) => {
    console.log("data updated", data);
  };

  const searchData = async (searchCriteria) => {
    // // pageNo = parseInt(pageNo);
    // // let start = state.pageLength * (pageNo - 1);
    // let searchCriteriaQueryString = "";
    // if (searchCriteria) {
    //   for (let key in searchCriteria) {
    //     searchCriteriaQueryString += `${key}=${searchCriteria[key]}&`;
    //   }
    //   //remove Last "&"
    //   searchCriteriaQueryString = searchCriteriaQueryString.substr(
    //     0,
    //     searchCriteriaQueryString.length - 1
    //   );
    // }
    // let resp = await fetch(
    //   `https://algo-blog-api.herokuapp.com/api/articles?${searchCriteriaQueryString}&offset=0&limit=${state.pageLength}`
    //   //&_sort=${state.sort.sortCol}&_order=${state.sort.sortOrder
    // );
    // let data = await resp.json();
    // setState({
    //   ...state,
    //   data: data.articles,
    //   totalRecords: data.articles_count,
    // });
  };

  const onSubmit = (model) => {
    console.log("onsubmit", model);
    searchData(model);
  };
  return (
    <div className="App">
      <DynamicForm
        key={"aaa"}
        className="form"
        title="Registration"
        defaultValues={DEFAULT_DATA.current}
        model={[
          // { key: "title", label: "Title", props: { required: true } },
          // { key: "slug", label: "Slug" },
          // { key: "body", label: "Body" },

          {
            key: "tag",
            label: "Tags",
            type: "select",
            value: "",
            api: "https://algo-blog-api.herokuapp.com/api/tags",
            transform: (respData) => {
              let data = respData.tags;
              let options = [];
              data.map((item) => {
                options.push({ key: item, label: item, value: item });
              });

              return options;
            },
            options: [
              // { key: "mumbai", label: "Mumbai", value: "Mumbai" },
              // { key: "bangalore", label: "Bangalore", value: "Bangalore" },
              // { key: "kerala", label: "Kerala", value: "Kerala" },
            ],
          },
          {
            key: "favorited",
            label: "Favorited",
            type: "radio",
            options: [
              { key: "true", label: "Yes", name: "favorited", value: "true" },
              { key: "false", label: "No", name: "favorited", value: "false" },
            ],
          },
        ]}
        onSubmit={(model) => {
          onSubmit(model);
        }}
      />
      {/* serverside */}
      <DataTable
        serverSideDataLoad={true}
        // headers={state.headers}
        data={[]}
        className="data-table"
        title="USER PROFILES"
        keyField="id"
        edit={false}
        serverSideDataLoad={true}
        server={{
          data: {
            endpoint: "https://algo-blog-api.herokuapp.com/api/articles",
            dataKey: "articles",
            totalRecordsKey: "articles_count",
          },
          // countRecords: {
          //   endpoint: "https://algo-blog-api.herokuapp.com/api/articles",
          //   totalRecordsKey: "articles",
          // },
        }}
        maxHeight={"300px"}
        pagination={{
          enabled: true,
          pageLength: 15, //state.pageLength, //for server side keep in state
          type: "long", // long, short
          // onChangePage: fetchDataOnly,
          startQueryKey: "offset",
          limitQueryKey: "limit",
        }}
        sort={{
          enabled: true,
          sortCol: state.sort.sortCol,
          sortOrder: state.sort.sortOrder,
        }}
        width="100%"
        headers={state.headers}
        data={state.data}
        noData="No records!"
        onUpdateData={onUpdateData}
      />
      {/* Hardcoded data */}
      <DataTable
        serverSideDataLoad={false}
        headers={[
          {
            title: "Id",
            accessor: "id",
            index: 1,
            dataType: "number",
          },
          {
            title: "Title",
            accessor: "title",
            index: 2,
            dataType: "string",
          },
        ]}
        data={[
          {
            userId: 1,
            id: 17,
            title: "quo laboriosam deleniti aut qui",
            completed: true,
          },
          {
            userId: 1,
            id: 18,
            title: "dolorum est consequatur ea mollitia in culpa",
            completed: false,
          },
          {
            userId: 1,
            id: 19,
            title: "molestiae ipsa aut voluptatibus pariatur dolor nihil",
            completed: true,
          },
          {
            userId: 1,
            id: 20,
            title: "ullam nobis libero sapiente ad optio sint",
            completed: true,
          },
        ]}
      />
    </div>
  );
}

export default Gvm;
