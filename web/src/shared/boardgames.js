// @flow

import { GRAPHQL_BOARD_GAMES_ROUTE } from './routes';

// eslint-disable-next-line import/prefer-default-export
export const searchBoardGames = async (term: string) => {
  const query = `query Query($search: String) {
    boardgames(search: $search) {
      slug
      name
      bgg_rating
      players_number {
        from
        to
      }
      age_restriction {
        from
        to
      }
      playing_time {
        from
        to
      }
      year_published
      box_image {
        uri
      }
    }
  }`;
  const res = await fetch(GRAPHQL_BOARD_GAMES_ROUTE, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { search: term },
    }),
  });
  if (!res.ok) {
    throw Error(res.statusText);
  }
  const json = await res.json();
  if (!json.data) {
    throw Error('No data received');
  }
  return json.data;
};
