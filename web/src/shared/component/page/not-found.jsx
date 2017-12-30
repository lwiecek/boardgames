// @flow

import React from 'react';
import Helmet from 'react-helmet';

import Title from '../title';
import Nav from '../nav';

const title = 'Page Not Found';

const NotFoundPage = () => (
  <div>
    <Helmet title={title} />
    <Title>{title}</Title>
    <Nav />
  </div>
);

export default NotFoundPage;
