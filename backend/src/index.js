// @flow

import express from 'express';
import graphqlHTTP from 'express-graphql';
import config from 'config';

import schema from './schema';
import root from './root';


const app = express();
app.use((req, res, next) => {
  // To access GraphQL server running different port on localhost.
  let oneof = false;
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // intercept OPTIONS method
  if (oneof && req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
const endpoint = config.get('graphql.endpoint');
const port = config.get('graphql.port');
app.use(endpoint, graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// This check and export are required for running tests using supertest.
// !module.parent ensures only one server is created.
if (!module.parent) {
  app.listen(port);
  console.log(`Running a GraphQL API server at http://localhost:${port}${endpoint}`);
}
export default app;
