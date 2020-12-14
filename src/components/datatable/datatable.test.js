import React from "react";
import { render, screen } from "@testing-library/react";
import DataTable from "./";

function getData(overrides) {
  let state = {
    headers: [
      {
        title: "id",
        accessor: "id",
        width: "80px",
        dataType: "string",
        index: 1,
      },
      {
        title: "Name",
        accessor: "name",
        width: "300px",
        index: 2,
        dataType: "string",
      },
      {
        title: "Rating",
        accessor: "rating",
        index: 1,
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
    ],
    data: [
      {
        id: 1,
        name: "john",
        rating: "3",
      },
      {
        id: 2,
        name: "amar",
        rating: "4",
      },
      {
        id: 3,
        name: "floppy",
        rating: "5",
      },
    ],
    ...overrides,
  };

  return state;
}

describe("Simple data table use cases", () => {
  it("Renders a basic Data Table", () => {
    let state = getData();

    const { container, getByText } = render(
      <DataTable
        className="data-table"
        title="USER PROFILES"
        keyField="id"
        width="100%"
        headers={state.headers}
        data={state.data}
        noData="No records!"
      />
    );
    const text = getByText(/USER PROFILES/i);
    expect(text).toBeInTheDocument();
    expect(container.querySelectorAll("tr").length).toBe(4);
  });

  it("Renders a basic Data Table with no data", () => {
    let state = getData({ data: [] });

    const { container, getByText } = render(
      <DataTable
        className="data-table"
        title="USER PROFILES"
        keyField="id"
        width="100%"
        headers={state.headers}
        data={state.data}
        noData="No records!"
      />
    );
    const text = getByText(/No records!/i);
    // screen.debug();
    expect(text).toBeInTheDocument();
    expect(container.querySelectorAll("tr").length).toBe(2);
  });

  it("Renders a custom column", () => {
    let state = getData();

    const { container, getByText } = render(
      <DataTable
        className="data-table"
        title="USER PROFILES"
        keyField="id"
        width="100%"
        headers={state.headers}
        data={state.data}
        noData="No records!"
      />
    );
    expect(container.querySelectorAll(".rating").length).toBe(3);
  });
});
