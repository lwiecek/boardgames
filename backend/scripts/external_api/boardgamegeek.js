import { promisify } from 'util';
import config from 'config';
import request from 'superagent';
import xml2js from 'xml2js';

import { sleep, upsertBoardGamesFromIDs } from './bgg_util';

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
  // ¯\_(ツ)_/¯
  // BGG XML API (v1 or v2) does not suport listing all (or at least popular) games
  // As a workaround I am scraping board games list page for several consecutive pages
  // to get board game ids using regexp.
  let urlFragmentsSet = new Set();
  for (let i = 0; i < config.boardgamegeek.number_of_pages; i += 1) {
    const page = `${config.boardgamegeek.board_games_list_url}/page/${i}`;
    // await in a for loop is fine in this case
    // since this needs to run sequentially due to rate limiting
    // eslint-disable-next-line no-await-in-loop
    await sleep(config.boardgamegeek.requests_delay_in_ms);
    // eslint-disable-next-line no-await-in-loop
    const response = await request.get(page);
    const urlFragments = response.text.match(/boardgame\/(\d+)\//g);
    urlFragmentsSet = new Set([...urlFragmentsSet, ...urlFragments]);
  }
  const ids = [];
  urlFragmentsSet.forEach((frag) => {
    ids.push(frag.match(/\d+/g)[0]);
  });
  await upsertBoardGamesFromIDs(ids);
}

if (command === 'sample_boardgames') {
  sampleBoardGames();
} else if (command === 'load_boardgames') {
  loadBoardGames();
}

