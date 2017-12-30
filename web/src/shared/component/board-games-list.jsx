// @flow

import React from 'react';

type Props = {
  game: Array<string>,
};

const BoardGamesList = ({ games }: Props) => {
  const listItems = games.map((game) =>
    <li>{game.name} <b>{game.bgg_rating}</b></li>
  );
  return (
    <ul>{listItems}</ul>
  );
};

export default BoardGamesList;
