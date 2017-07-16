#!/usr/bin/env node
'use strict';

const config = require('config');
const argv = require('yargs')
    .demandCommand(1)
    .usage('Usage: $0 <command>')
    .command('load_boardgames', 'Load all board games data from boardgamegeek xml api2')
    .example('$0 load_boardgames', 'Load all board games data from boardgamegeek xml api2')
    .help('help')
    .alias('h', 'help')
    .strict()
    .argv;

console.dir(argv);