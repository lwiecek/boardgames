// @flow

import React from 'react';
import Helmet from 'react-helmet';

import Title from '../title';
import { APP_NAME } from '../../config';

import BoardGamesList from '../../container/board-games-list';

const HomePage = () => (
  <div>
    <Helmet
      meta={[
        { name: 'description', content: 'Board Games List.' },
        { property: 'og:title', content: APP_NAME },
      ]}
    />
    <Title />
    <BoardGamesList />
  </div>
);

export default HomePage;
