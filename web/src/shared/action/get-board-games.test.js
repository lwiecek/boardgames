import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import Immutable from 'immutable';

import {
  getBoardGamesAsync,
  getBoardGamesAsyncRequest,
  getBoardGamesAsyncSuccess,
  getBoardGamesAsyncFailure,
} from './get-board-games';

import { GRAPHQL_BOARD_GAMES_ROUTE } from '../routes';

const mockStore = configureMockStore([thunkMiddleware]);

afterEach(() => {
  fetchMock.restore();
});

test('getBoardGamesAsync success', async () => {
  fetchMock.post(GRAPHQL_BOARD_GAMES_ROUTE, Immutable.fromJS({ data: { boardgames: [{ name: 'Gloomhaven' }] } }));
  const store = mockStore();
  await store.dispatch(getBoardGamesAsync());
  expect(store.getActions()).toEqual([
    getBoardGamesAsyncRequest(),
    getBoardGamesAsyncSuccess(Immutable.fromJS({ boardgames: [{ name: 'Gloomhaven' }] })),
  ]);
});

test('getBoardGamesAsync 404', async () => {
  fetchMock.get('/404_not_found', 404);
  const store = mockStore();
  await store.dispatch(getBoardGamesAsync());
  expect(store.getActions()).toEqual([
    getBoardGamesAsyncRequest(),
    getBoardGamesAsyncFailure(),
  ]);
});

test('getBoardGamesAsync data error', async () => {
  fetchMock.get(GRAPHQL_BOARD_GAMES_ROUTE, Immutable.fromJS({}));
  const store = mockStore();
  await store.dispatch(getBoardGamesAsync());
  expect(store.getActions()).toEqual([
    getBoardGamesAsyncRequest(),
    getBoardGamesAsyncFailure(),
  ]);
});
