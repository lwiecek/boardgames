#!/usr/bin/env node
'use strict';

const config = require('config');
const pg = require('pg');

const client = new pg.Client();
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
    });
  }, (err) => {
    console.log('FAILURE');
    throw err;
  });
});


