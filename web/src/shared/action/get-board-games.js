// @flow

import 'isomorphic-fetch';

import { createAction } from 'redux-actions';
import { searchBoardGames } from '../boardgames';

export const GET_BOARD_GAMES_ASYNC_REQUEST = 'GET_BOARD_GAMES_ASYNC_REQUEST';
export const GET_BOARD_GAMES_ASYNC_SUCCESS = 'GET_BOARD_GAMES_ASYNC_SUCCESS';
export const GET_BOARD_GAMES_ASYNC_FAILURE = 'GET_BOARD_GAMES_ASYNC_FAILURE';

export const getBoardGamesAsyncRequest = createAction(GET_BOARD_GAMES_ASYNC_REQUEST);
export const getBoardGamesAsyncSuccess = createAction(GET_BOARD_GAMES_ASYNC_SUCCESS);
export const getBoardGamesAsyncFailure = createAction(GET_BOARD_GAMES_ASYNC_FAILURE);

export const getBoardGamesAsync = () => async (dispatch: Function) => {
  dispatch(getBoardGamesAsyncRequest());
  try {
    const json = await searchBoardGames('');
    const action = getBoardGamesAsyncSuccess(json.data);
    console.log(getBoardGamesAsyncSuccess);
    dispatch(action);
  } catch (err) {
    dispatch(getBoardGamesAsyncFailure());
  }
};
