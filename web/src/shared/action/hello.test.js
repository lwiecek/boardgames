import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';

import {
  sayHelloAsync,
  sayHelloAsyncRequest,
  sayHelloAsyncSuccess,
  sayHelloAsyncFailure,
} from './hello';

import { helloEndpointRoute } from '../../shared/routes';

const mockStore = configureMockStore([thunkMiddleware]);

afterEach(() => {
  fetchMock.restore();
});

test('sayHelloAsync success', async () => {
  fetchMock.get(helloEndpointRoute(666), { serverMessage: 'Async hello success' });
  const store = mockStore();
  await store.dispatch(sayHelloAsync(666));
  expect(store.getActions()).toEqual([
    sayHelloAsyncRequest(),
    sayHelloAsyncSuccess('Async hello success'),
  ]);
});

test('sayHelloAsync 404', async () => {
  fetchMock.get(helloEndpointRoute(666), 404);
  const store = mockStore();
  await store.dispatch(sayHelloAsync(666));
  expect(store.getActions()).toEqual([
    sayHelloAsyncRequest(),
    sayHelloAsyncFailure(),
  ]);
});

test('sayHelloAsync data error', async () => {
  fetchMock.get(helloEndpointRoute(666), {});
  const store = mockStore();
  await store.dispatch(sayHelloAsync(666));
  expect(store.getActions()).toEqual([
    sayHelloAsyncRequest(),
    sayHelloAsyncFailure(),
  ]);
});
