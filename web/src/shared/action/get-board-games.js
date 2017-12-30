// @flow

import 'isomorphic-fetch';
import Immutable from 'immutable';

import { createAction } from 'redux-actions';
import { searchBoardGames } from '../boardgames';


export const GET_BOARD_GAMES_ASYNC_REQUEST = 'GET_BOARD_GAMES_ASYNC_REQUEST';
export const GET_BOARD_GAMES_ASYNC_SUCCESS = 'GET_BOARD_GAMES_ASYNC_SUCCESS';
export const GET_BOARD_GAMES_ASYNC_FAILURE = 'GET_BOARD_GAMES_ASYNC_FAILURE';

export const getBoardGamesAsyncRequest = createAction(GET_BOARD_GAMES_ASYNC_REQUEST);
export const getBoardGamesAsyncSuccess = createAction(GET_BOARD_GAMES_ASYNC_SUCCESS);
export const getBoardGamesAsyncFailure = createAction(GET_BOARD_GAMES_ASYNC_FAILURE);

export const getBoardGamesAsync = () => async (dispatch: Function, getState: Function) => {
  const boardgames = getState().boardgames.get('boardgames');
  if ((boardgames === null) || (boardgames && boardgames.size > 0)) {
    return;
  }
  dispatch(getBoardGamesAsyncRequest());
  try {
    const json = await searchBoardGames('');
    dispatch(getBoardGamesAsyncSuccess(Immutable.fromJS(json)));
  } catch (err) {
    console.error(err);
    dispatch(getBoardGamesAsyncFailure());
  }
};
