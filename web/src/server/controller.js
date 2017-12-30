// @flow

import { searchBoardGames } from '../shared/boardgames';

export const homePage = () => null;

export const allGamesPage = async () => searchBoardGames('');

export const gameDetailPage = () => ({
  boardgame: { name: 'Gloomhaven', slug: 'gloomhaven', description: '...' },
});
