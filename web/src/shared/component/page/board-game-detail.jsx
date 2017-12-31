// @flow

import React from 'react';
import Helmet from 'react-helmet';

import Title from '../title';

const BoardGameDetailPage = ({ game }: { game: any }) => {
  let title;
  if (game === undefined) {
    title = 'LOADING';
  } else {
    title = game.get('name');
  }
  return (
    <div>
      <Helmet
        title={title}
        meta={[
          { name: 'description', content: 'Board game details page.' },
          { property: 'og:title', content: title },
        ]}
      />
      <Title>{title}</Title>
    </div>
  );
};

export default BoardGameDetailPage;
