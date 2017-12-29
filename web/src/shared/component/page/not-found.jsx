// @flow

import React from 'react';
import Helmet from 'react-helmet';

const title = 'Page Not Found';
import Title from '../title';
import Nav from '../nav';

const NotFoundPage = () => (
  <div>
    <Helmet title={title} />
    <Title>{title}</Title>
    <Nav />
  </div>
);

export default NotFoundPage;
