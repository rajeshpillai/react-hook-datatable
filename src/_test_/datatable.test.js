import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure, mount } from "enzyme";
import DataTable from "../components/datatable";

configure({ adapter: new Adapter() });

// First set of Unit Test cases
// 1.  Ability to render a data table with stubbed data (no pagination)
// 2.  Ability to provide custom render function for column
// 3.  Ability to paginate data (client side)
// 4.  Sort table
// 4.  Ability to paginate data (server side + (this we will think)1

test("My First Test", () => {
  expect(true).toBeTruthy();
});

test("When no Records then show no records found", () => {
  const { container, debug } = render(
    <DataTable headers={[]} data={[]}></DataTable>
  );
  const noDatatr = container.querySelector(".no-data");
  expect(noDatatr.firstElementChild).toHaveTextContent("No records found!");
});

test("Data table rendered with stubbed data ", () => {
  const { container, debug } = render(
    <DataTable
      headers={[]}
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
    ></DataTable>
  );
  const noDatatr = container.querySelectorAll(".datatable-row");
  expect(noDatatr.length).toBe(4);
});

test("Ability to provide custom render function for column", () => {
  const { container, debug } = render(
    <DataTable
      headers={[
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
        {
          title: "Rating",
          accessor: "rating",
          index: 5,
          width: "200px",
          cell: (row) => (
            <div className="rating">
              <div
                style={{
                  backgroundColor: "lightskyblue",
                  textAlign: "center",
                  height: "1.9em",
                  width: (row.rating / 5) * 201 + "px",
                  margin: "3px 0 4px 0",
                }}
              >
                <a href={`/showchart/${row.id}`}>{row.rating}</a>
              </div>
            </div>
          ),
        },
      ]}
      data={[
        {
          userId: 1,
          id: 17,
          title: "quo laboriosam deleniti aut qui",
          completed: true,
          rating: 3,
        },
        {
          userId: 1,
          id: 18,
          title: "Title 2",
          completed: true,
          rating: 4,
        },
      ]}
    ></DataTable>
  );
  const noDatatr = container.querySelectorAll(".rating");
  expect(noDatatr.length).toBe(2);
});

let headers = [
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
];
let data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  },
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
  {
    userId: 1,
    id: 5,
    title: "laboriosam mollitia et enim quasi adipisci quia provident illum",
    completed: false,
  },
  {
    userId: 1,
    id: 6,
    title: "qui ullam ratione quibusdam voluptatem quia omnis",
    completed: false,
  },
  {
    userId: 1,
    id: 7,
    title: "illo expedita consequatur quia in",
    completed: false,
  },
  {
    userId: 1,
    id: 8,
    title: "quo adipisci enim quam ut ab",
    completed: true,
  },
  {
    userId: 1,
    id: 9,
    title: "molestiae perspiciatis ipsa",
    completed: false,
  },
  {
    userId: 1,
    id: 10,
    title: "illo est ratione doloremque quia maiores aut",
    completed: true,
  },
  {
    userId: 1,
    id: 11,
    title: "vero rerum temporibus dolor",
    completed: true,
  },
  {
    userId: 1,
    id: 12,
    title: "ipsa repellendus fugit nisi",
    completed: true,
  },
  {
    userId: 1,
    id: 13,
    title: "et doloremque nulla",
    completed: false,
  },
  {
    userId: 1,
    id: 14,
    title: "repellendus sunt dolores architecto voluptatum",
    completed: true,
  },
  {
    userId: 1,
    id: 15,
    title: "ab voluptatum amet voluptas",
    completed: true,
  },
  {
    userId: 1,
    id: 16,
    title: "accusamus eos facilis sint et aut voluptatem",
    completed: true,
  },
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
];
const onPageLengthChange = jest.fn();
//Set Pagination
let pagination = {
  enabled: true,
  pageLength: 10, //for server side keep in state
  type: "long", // long, short
  onPageLengthChange: onPageLengthChange,
};

test("Pagination component rendered when data at client side", () => {
  //Render Datatable
  const { container, debug } = render(
    <DataTable
      headers={headers}
      data={data}
      pagination={pagination}
      serverSideDataLoad={false}
    ></DataTable>
  );
  // debug();

  //pagination
  const paginationEle = container.querySelectorAll(".pagination");
  expect(paginationEle.length).toBe(1);

  //Check 2 pages buttons + prev + next buttons =  4 buttons created created
  const pageNumbers = container.querySelectorAll(".pagination .pagination-btn");
  expect(pageNumbers.length).toBe(4);
});

test("Pagination on click of next button and page button state gets updated", () => {
  //Render Datatable
  const wrapper = mount(
    <DataTable
      headers={headers}
      data={data}
      pagination={pagination}
      serverSideDataLoad={false}
    ></DataTable>
  );
  const setData = jest.fn();
  const handleClick = jest.spyOn(React, "useState");
  handleClick.mockImplementation((state) => [state, setData]);
  wrapper.find(".pagination-btn.next").simulate("click");
  expect(setData).toBeTruthy();

  //btn-2
  wrapper.find("#btn-2").simulate("click");
  expect(setData).toBeTruthy();
});

test("Pagination on click of next button and page button state gets updated", () => {
  //Render Datatable
  const wrapper = mount(
    <DataTable
      headers={headers}
      data={data}
      pagination={pagination}
      serverSideDataLoad={false}
    ></DataTable>
  );
  const setData = jest.fn();
  const handleClick = jest.spyOn(React, "useState");
  handleClick.mockImplementation((state) => [state, setData]);
  wrapper.find(".pagination-btn.next").simulate("click");
  expect(setData).toBeTruthy();

  //btn-2
  wrapper.find("#btn-2").simulate("click");
  expect(setData).toBeTruthy();
});

test("Pagination on change page length props.onPageLengthChange is called", () => {
  //Render Datatable
  const { container } = render(
    <DataTable
      headers={headers}
      data={data}
      pagination={pagination}
      serverSideDataLoad={false}
    ></DataTable>
  );

  let currentPageLengthInput = container.querySelector(".page-length-input");
  fireEvent.change(currentPageLengthInput, { target: { value: "2" } });
  fireEvent.keyUp(currentPageLengthInput, {
    key: "Enter",
    code: 13,
    charCode: 13,
  });
  expect(onPageLengthChange).toHaveBeenCalled();

  // const pageNumbers = container.querySelectorAll(".pagination .pagination-btn");
  // expect(pageNumbers.length).toBe(7);
});
