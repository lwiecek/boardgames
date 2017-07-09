#!/usr/bin/env node
'use strict';

const config = require('config');
const pg = require('pg');
const fs = require('fs');
const dbName = config.get('database.name');
const pgConfig = {
  database: dbName
}
const client = new pg.Client(pgConfig);

if (process.env.NODE_ENV !== 'test') {
  console.log('loading fixtures is only allowed in test environment');
  process.exit(1);
}

fs.readFile('fixtures/test.sql', (err, data) => {
  if (err) {
    console.log('FAILURE');
    throw err;
  }
  client.connect((err) => {
    if (err) {
      console.log('FAILURE');
      throw err;
    }
    console.log(`loading fixtures in ${dbName}`);
    client.query(data.toString()).then(() => {
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
});
