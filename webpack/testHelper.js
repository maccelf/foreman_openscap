import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { MemoryRouter } from 'react-router-dom';
import { getForemanContext } from 'foremanReact/Root/Context/ForemanContext';

export const withRouter = Component => props => (
  <MemoryRouter>
    <Component {...props} />
  </MemoryRouter>
);

export const withMockedProvider = Component => props => {
  const ForemanContext = getForemanContext(ctx);
  // eslint-disable-next-line react/prop-types
  const { mocks, ...rest } = props;

  const ctx = {
    metadata: {
      UISettings: {
        perPage: 20,
      },
    },
  };

  return (
    <ForemanContext.Provider value={ctx}>
      <MockedProvider mocks={mocks}>
        <Component {...rest} />
      </MockedProvider>
    </ForemanContext.Provider>
  );
};

// use to resolve async mock requests for apollo MockedProvider
export const tick = () => new Promise(resolve => setTimeout(resolve, 0));

export const historyMock = {
  location: {
    search: '',
  },
};

export const admin = {
  __typename: 'User',
  id: 'MDE6VXNlci00',
  login: 'admin',
  admin: true,
  permissions: {
    nodes: [],
  },
};

export const userFactory = (login, permissions = []) => ({
  __typename: 'User',
  id: 'MDE6VXNlci01',
  login,
  admin: false,
  permissions: {
    nodes: permissions,
  },
});

export const intruder = userFactory('intruder', [
  {
    __typename: 'Permission',
    id: 'MDE6UGVybWlzc2lvbi0x',
    name: 'view_architectures',
  },
]);

export const mockFactory = (resultName, query) => (
  variables,
  modelResults,
  { errors = [], currentUser = null }
) => {
  const mock = {
    request: {
      query,
      variables,
    },
    result: {
      data: {
        [resultName]: modelResults,
      },
    },
  };

  if (errors.length !== 0) {
    mock.result.errors = errors;
  }

  if (currentUser) {
    mock.result.data.currentUser = currentUser;
  }
  return [mock];
};
