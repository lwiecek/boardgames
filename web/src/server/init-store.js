// @flow

import Immutable from 'immutable';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import boardGamesReducer from '../shared/reducer/board-games';

const initStore = (plainPartialState: ?Object) => {
  const preloadedState = plainPartialState ? {} : undefined;
  if (plainPartialState && plainPartialState.boardgames) {
    // flow-disable-next-line
    preloadedState.boardgames = boardGamesReducer(undefined, {})
      .merge(Immutable.fromJS(plainPartialState));
  }

  return createStore(
    combineReducers({ boardgames: boardGamesReducer }),
    preloadedState, applyMiddleware(thunkMiddleware),
  );
};

export default initStore;
