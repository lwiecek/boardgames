#!/usr/bin/env node
'use strict';

const config = require('config');
const request = require('request');
const xml2js = require('xml2js');
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

function createOrUpdateBoardGame(id) {
  request(`${config.get('boardgamegeek.api_url')}/thing?type=boardgame&id=${id}`, (err, response, body) => {
    if (err) {
      throw err;
    }
    xml2js.parseString(body, function (err, result) {
      console.dir(result.items.item);
    });
  });
}

if (command === 'sample_boardgames') {
  const sampleGeeklistID = 1;
  request(`${config.get('boardgamegeek.api_url')}/geeklist/${sampleGeeklistID}`, (err, response, body) => {
    if (err) {
      throw err;
    }
    xml2js.parseString(body, function (err, result) {
      for (let item of result.geeklist.item) {
        if (item['$'].subtype === 'boardgame') {
          createOrUpdateBoardGame(item['$'].objectid)
        }
      }
    });
  });
} else if (command === 'load_boardgames') {

}