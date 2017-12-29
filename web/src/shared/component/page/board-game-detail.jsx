// @flow

import React from 'react';
import Helmet from 'react-helmet';

import HelloAsyncButton from '../../container/hello-async-button';
import MessageAsync from '../../container/message-async';
import Title from '../title';
import Nav from '../nav';

const title = 'Gloomhaven';

const BoardGameDetailPage = () => (
  <div>
    <Helmet
      title={title}
      meta={[
        { name: 'description', content: 'Board game details page.' },
        { property: 'og:title', content: title },
      ]}
    />
    <Title>{title}</Title>
    <Nav />
    <MessageAsync />
    <HelloAsyncButton />
  </div>
);

export default BoardGameDetailPage;
