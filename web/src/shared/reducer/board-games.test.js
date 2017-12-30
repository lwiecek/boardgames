import Immutable from 'immutable';
import {
  getBoardGamesAsyncRequest,
  getBoardGamesAsyncSuccess,
  getBoardGamesAsyncFailure,
} from '../action/get-board-games';

import boardGamesReducer from './board-games';

let boardGamesState;

beforeEach(() => {
  boardGamesState = boardGamesReducer(undefined, {});
});

test('handle default', () => {
  expect(boardGamesState.get('boardgames')).toEqual(undefined);
});

test('handle GET_BOARD_GAMES_ASYNC_REQUEST', () => {
  boardGamesState = boardGamesReducer(boardGamesState, getBoardGamesAsyncRequest());
  expect(boardGamesState.get('boardgames')).toBe(undefined);
});

test('handle GET_BOARD_GAMES_ASYNC_SUCCESS', () => {
  boardGamesState = boardGamesReducer(
    boardGamesState,
    getBoardGamesAsyncSuccess(Immutable.fromJS({ boardgames: [{ name: 'Gloomhaven' }] })),
  );
  expect(boardGamesState.get('boardgames')).toEqual(Immutable.fromJS([{ name: 'Gloomhaven' }]));
});

test('handle GET_BOARD_GAMES_ASYNC_FAILURE', () => {
  boardGamesState = boardGamesReducer(boardGamesState, getBoardGamesAsyncFailure());
  expect(boardGamesState.get('boardgames')).toEqual(null);
});
