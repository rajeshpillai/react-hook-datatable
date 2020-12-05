import React from 'react';
import { render, screen } from '@testing-library/react';
import DataTable from './';

function getData(overrides) {
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
      }
    ],
    data: [
      {
        id: 1,
        name: "a"
      },
      {
        id: 2,
        name: "b"       
      },
      {
        id: 3,
        name: "c"
      }
    ],
    ...overrides
  };

  return state;
}

test('Renders a basic Data Table', () => {
  let state = getData();

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


test('Renders a basic Data Table with no data', () => {
  let state = getData({data: []});

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
  const text = getByText(/No records!/i);
  screen.debug();
  expect(text).toBeInTheDocument();
});
