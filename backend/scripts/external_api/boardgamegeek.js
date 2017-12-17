import { promisify } from 'util';
import config from 'config';
import request from 'superagent';
import xml2js from 'xml2js';

import upsertBoardGamesFromIDs from './bgg_util';

const { argv } = require('yargs')
  .demandCommand(1)
  .usage('Usage: $0 <command>')
  .command('sample_boardgames', 'Load sample board games data from boardgamegeek xml api2')
  .command('load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .example('$0 load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .help('help')
  .alias('h', 'help')
  .strict();

const xml2jsParseString = promisify(xml2js.parseString);

const command = argv._[0];

async function sampleBoardGames() {
  const sampleGeeklistID = 1;
  const response = await request.get(`${config.boardgamegeek.api_url}/geeklist/${sampleGeeklistID}`);
  if (response.statusCode !== 200) {
    throw new Error(`Failed board game response: ${response.statusCode}, geeklist: ${sampleGeeklistID}`);
  }
  const result = await xml2jsParseString(response.text);
  const boardGames = result.geeklist.item.filter(elm => elm.$.subtype === 'boardgame');
  const ids = boardGames.map(elm => elm.$.objectid);
  await upsertBoardGamesFromIDs(ids);
}

async function loadBoardGames() {
  const ids = Array(config.boardgamegeek.max_boardgame_id).fill().map((e, i) => i + 1);
  await upsertBoardGamesFromIDs(ids);
}

if (command === 'sample_boardgames') {
  sampleBoardGames();
} else if (command === 'load_boardgames') {
  loadBoardGames();
}

