// @flow

import React from 'react';
import Helmet from 'react-helmet';

import Title from '../title';
import Nav from '../nav';
import BoardGamesList from '../../container/board-games-list';

const title = 'All Games';

const BoardGamesPage = () => (
  <div>
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'List of all board games.' },
        { property: 'og:title', content: title },
      ]}
    />
    <Title>{title}</Title>
    <Nav />
    <BoardGamesList />
  </div>
);

export default BoardGamesPage;
