// @flow

import {
  homePage,
  allGamesPage,
  gameDetailPage,
} from './controller';

import {
  HOME_PAGE_ROUTE,
  ALL_GAMES_ROUTE,
  GAME_DETAIL_PAGE_ROUTE,
} from '../shared/routes';

import renderApp from './render-app';

export default (app: Object) => {
  app.get(HOME_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, homePage()));
  });

  app.get(ALL_GAMES_ROUTE, async (req, res) => {
    const data = await allGamesPage();
    // console.log('DUPA');
    // console.log(data);
    res.send(renderApp(req.url, data));
  });

  app.get(GAME_DETAIL_PAGE_ROUTE, (req, res) => {
    res.send(renderApp(req.url, gameDetailPage()));
  });

  app.get('*', (req, res) => {
    res.status(404).send(renderApp(req.url));
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
};
