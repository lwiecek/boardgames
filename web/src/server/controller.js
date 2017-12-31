// @flow

import { searchBoardGames } from '../shared/boardgames';

export const homePage = async () => searchBoardGames('');

export const gameDetailPage = () => ({
  boardgame: { name: 'Gloomhaven', slug: 'gloomhaven', description: '...' },
});
