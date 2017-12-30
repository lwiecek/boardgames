// @flow

import Immutable from 'immutable';
import type { fromJS as Immut } from 'immutable';

import {
  GET_BOARD_GAMES_ASYNC_REQUEST,
  GET_BOARD_GAMES_ASYNC_SUCCESS,
  GET_BOARD_GAMES_ASYNC_FAILURE,
} from '../action/get-board-games';

const initialState = Immutable.fromJS({ boardgames: [] });

const boardGamesReducer = (state: Immut = initialState, action: { type: string, payload: any }) => {
  switch (action.type) {
    case GET_BOARD_GAMES_ASYNC_REQUEST:
      return state.set('boardgames', undefined);
    case GET_BOARD_GAMES_ASYNC_SUCCESS:
      return state.set('boardgames', action.payload.get('boardgames'));
    case GET_BOARD_GAMES_ASYNC_FAILURE:
      return state.set('boardgames', null);
    default:
      return state;
  }
};

export default boardGamesReducer;
