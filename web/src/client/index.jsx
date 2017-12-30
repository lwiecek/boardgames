
// @flow

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import App from '../shared/app';
import boardGamesReducer from '../shared/reducer/board-games';
import { APP_CONTAINER_SELECTOR } from '../shared/config';
import { isProd } from '../shared/util';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (isProd ? null : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const preloadedState = window.__PRELOADED_STATE__;
/* eslint-enable no-underscore-dangle */

const store = createStore(
  combineReducers({ boardgames: boardGamesReducer }),
  { boardgames: Immutable.fromJS(preloadedState.boardgames) },
  composeEnhancers(applyMiddleware(thunkMiddleware)),
);

const rootEl = document.querySelector(APP_CONTAINER_SELECTOR);
if (!(rootEl instanceof Element)) {
  throw new Error('invalid type for rootEl');
}

const wrapApp = (AppComponent, reduxStore) => (
  <Provider store={reduxStore}>
    <BrowserRouter>
      <AppContainer>
        <AppComponent />
      </AppContainer>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(wrapApp(App, store), rootEl);

if (module.hot) {
  // flow-disable-next-line
  module.hot.accept('../shared/app', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('../shared/app').default;
    ReactDOM.render(wrapApp(NextApp, store), rootEl);
  });
}
