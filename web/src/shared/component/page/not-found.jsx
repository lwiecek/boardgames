// @flow

import React from 'react';
import Helmet from 'react-helmet';

import Title from '../title';

const title = 'Page Not Found';

const NotFoundPage = () => (
  <div>
    <Helmet title={title} />
    <Title>{title}</Title>
  </div>
);

export default NotFoundPage;
