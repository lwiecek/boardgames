// @flow


export const HOME_PAGE_ROUTE = '/';
export const ALL_GAMES_ROUTE = '/all';
export const GAME_DETAIL_PAGE_ROUTE = '/:boardgame';

export const helloEndpointRoute = (num: ?number) => `/ajax/hello/${num || ':num'}`;
