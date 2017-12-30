// @flow

import { searchBoardGames } from '../shared/boardgames';

export const homePage = () => null;

export const allGamesPage = async () => {
  return (await searchBoardGames('')).data;
};

export const gameDetailPage = () => ({
  boardgame: { name: 'Gloomhaven', slug: 'gloomhaven', description: '...' },
});