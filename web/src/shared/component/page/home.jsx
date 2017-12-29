// @flow

import React from 'react';
import Helmet from 'react-helmet';

import Title from '../title';
import Nav from '../nav';
import { APP_NAME } from '../../config';

const HomePage = () => (
  <div>
    <Helmet
      meta={[
        { name: 'description', content: 'Hello App is an app to say hello' },
        { property: 'og:title', content: APP_NAME },
      ]}
    />
    <Title />
    <Nav />
  </div>
);

export default HomePage;
