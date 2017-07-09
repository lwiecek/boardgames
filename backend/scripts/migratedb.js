#!/usr/bin/env node
'use strict';

const config = require('config');
const spawn = require('child_process').spawnSync;

const dbUsername = config.get('database.username');
const dbPassword = config.get('database.password');
const dbHost = config.get('database.host');
const dbName = config.get('database.name');

console.log(`migrating database ${dbName}`);
let env = Object.create(process.env);
env['DATABASE_URL'] = `postgres://${dbUsername}:${dbPassword}@${dbHost}/${dbName}`;

const pgMigrate = spawn('./node_modules/.bin/pg-migrate', ['up'], {env: env});
console.log(`stderr: ${pgMigrate.stderr.toString()}`);
console.log(`stdout: ${pgMigrate.stdout.toString()}`);
