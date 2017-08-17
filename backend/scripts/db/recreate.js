#!/usr/bin/env node
'use strict';

const config = require('config');
const pg = require('pg');

// FIXME Temporarily turned off due to testing of sample BGG data
// in development database, uncomment once I am happy with the initial data
// if (process.env.NODE_ENV !== 'test') {
//   console.log('database recreation is only allowed in test environment');
//   process.exit(1);
// }

const client = new pg.Client({
  // use this database for connection purposes, boardgames may be missing
  database: 'postgres'
});
const dbName = config.get('database.name');

client.connect(function (err) {
  if (err) {
    console.log('FAILURE');
    throw err;
  }
  // Remove all connections to the test database - required before DROP
  client.query(
    `SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname=$1`,
    [dbName],
  ).then(() => {
    console.log(`dropping database ${dbName}`);
    return client.query(`DROP DATABASE IF EXISTS ${dbName}`)
  }).then(() => {
    console.log(`creating database ${dbName}`);
    return client.query(`CREATE DATABASE ${dbName}`);
  }).then(() => {
    client.end(function (err) {
      if (err) {
        console.log('FAILURE');
        throw err;
      }
      console.log('SUCCESS');
    });
  }, (err) => {
    console.log('FAILURE');
    throw err;
  });
});
