// @flow

import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import Helmet from 'react-helmet';

import { APP_NAME } from './config';
import HomePage from './component/page/home';
import BoardGamesPage from './component/page/board-games';
import BoardGameDetailPage from './component/page/board-game-detail';
import NotFoundPage from './component/page/not-found';
import {
  HOME_PAGE_ROUTE,
  ALL_GAMES_ROUTE,
  GAME_DETAIL_PAGE_ROUTE,
} from './routes';

const App = () => (
  <div>
    <Helmet titleTemplate={`%s | ${APP_NAME}`} defaultTitle={APP_NAME} />
    <Switch>
      <Route exact path={HOME_PAGE_ROUTE} render={() => <HomePage />} />
      <Route path={ALL_GAMES_ROUTE} render={() => <BoardGamesPage />} />
      <Route path={GAME_DETAIL_PAGE_ROUTE} render={() => <BoardGameDetailPage />} />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);

export default App;
