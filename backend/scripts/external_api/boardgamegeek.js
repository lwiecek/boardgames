#!/usr/bin/env node
'use strict';

const config = require('config');
const request = require('request');
const argv = require('yargs')
  .demandCommand(1)
  .usage('Usage: $0 <command>')
  .command('sample_boardgames', 'Load sample board games data from boardgamegeek xml api2')
  .command('load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .example('$0 load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .help('help')
  .alias('h', 'help')
  .strict()
  .argv;

const command = argv._[0];
if (command === 'sample_boardgames') {
  request('https://www.boardgamegeek.com/xmlapi2/geeklist/1', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });
} else if (command === 'load_boardgames') {

}