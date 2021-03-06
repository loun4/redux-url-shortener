import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import store from '../../store';
import App from '../app';
import RouterProvider from '../router-provider';

let subject;
const testStore = store();

const buildSubject = props => (
  <RouterProvider>
    <Provider store={testStore}>
      <App {...props}>
        <div />
      </App>
    </Provider>
  </RouterProvider>
);

beforeEach(() => {
  subject = buildSubject();
});

test('Render app', () => {
  const component = renderer.create(subject);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Render error on get', () => {
  const component = renderer.create(
    buildSubject({
      error: {
        type: 'get',
      },
    })
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Render error on save', () => {
  const component = renderer.create(
    buildSubject({
      error: {
        type: 'save',
      },
    })
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Call authenticate on componentDidMount if session is ready for auth', () => {
  const authenticate = jest.fn();

  mount(
    buildSubject({
      session: {
        ...testStore.getState().session,
        readyToAuthenticate: true,
      },
      authenticate,
    })
  );

  expect(authenticate).toHaveBeenCalled();
});
