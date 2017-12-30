// @flow

import React from 'react';

type Props = {
  games: any,
};

const BoardGamesList = ({ games }: Props) => {
  if (games === undefined) {
    return <div>LOADING</div>;
  } else if (games === null) {
    return <div>FAILED TO LOAD</div>;
  }
  const listItems = games.map(game => <li key={game.get('slug')}>{game.get('name')} <b>{game.get('bgg_rating')}</b></li>);
  return (
    <div>
      <h2>Board Games:</h2>
      <ul>{listItems}</ul>
    </div>
  );
};

export default BoardGamesList;
