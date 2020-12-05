import React from 'react';
import { render } from '@testing-library/react';
import DataTable from './';

test('Renders a basic Data Table', () => {
  let state = {
    headers: [
      {
        title: "Profile",
        accessor: "profile",
        width: "80px",
        index: 1,
        cell: {
          type: "image",
          style: {
            width: "50px",
          },
        },
      },
      {
        title: "Name",
        accessor: "name",
        width: "300px",
        index: 2,
        dataType: "string",
      },
      { title: "Age", accessor: "age", index: 3, dataType: "number" },
      {
        title: "Qualification",
        accessor: "qualification",
        index: 4,
        dataType: "number",
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
    ],
    data: [
      {
        id: 1,
        name: "a",
        age: 29,
        qualification: "B.Com",
        rating: 3,
        profile:
          "https://assets.dryicons.com/uploads/icon/svg/5610/fff0263a-8f19-4b74-8f3d-fc24b9561a96.svg",
      },
      {
        id: 2,
        name: "b",
        age: 35,
        qualification: "B.Sc",
        rating: 5,
        profile:
          "https://assets.dryicons.com/uploads/icon/svg/5610/fff0263a-8f19-4b74-8f3d-fc24b9561a96.svg",
      },
      {
        id: 3,
        name: "c",
        age: 42,
        qualification: "B.E",
        rating: 3,
        profile:
          "https://assets.dryicons.com/uploads/icon/svg/5610/fff0263a-8f19-4b74-8f3d-fc24b9561a96.svg",
      },
    ],
  };


  const { getByText } = render(
    <DataTable
        className="data-table"
        title="USER PROFILES"
        keyField="id"
        edit={true}
        width="100%"
        headers={state.headers}
        data={state.data}
        noData="No records!"
      />
  );
  const text = getByText(/USER PROFILES/i);
  expect(text).toBeInTheDocument();
});
