#!/usr/bin/env node
'use strict';

const config = require('config');
const pg = require('pg');

const client = new pg.Client();

const dbName = config.get('database.name');
client.connect(function (err) {
  if (err) throw err;
  console.log(`dropping database ${dbName}`)
  client.query(`DROP DATABASE IF EXISTS ${dbName}`, function (err, result) {
    if (err) throw err;
    console.log(`creating database ${dbName}`)
    client.query(`CREATE DATABASE ${dbName}`, function (err, result) {
      if (err) throw err;
      client.end(function (err) {
        if (err) throw err;
      });
    });
  });
});

// const spawn = require('child_process').spawnSync;

// const dbUsername = config.get('database.username');
// const dbPassword = config.get('database.password');
// const dbHost = config.get('database.host');
// const dbName = config.get('database.name');

// let env = Object.create(process.env);
// env['PGPASSWORD'] = dbPassword;

// console.log(`dropping database ${dbName}`);
// const dropDB = spawn('dropdb', ['-h', dbHost, '-U', dbUsername, '--if-exists'], {env: env});
// console.log(`stderr: ${dropDB.stderr.toString()}`);
// console.log(`stdout: ${dropDB.stdout.toString()}`);

// console.log(`creating database ${dbName}`);
// const createDB = spawn('createdb', [dbName, '-h', dbHost, '-U', dbUsername], {env: env});
// console.log(`stderr: ${createDB.stderr.toString()}`);
// console.log(`stdout: ${createDB.stdout.toString()}`);

