import config from 'config';
import request from 'request';
import xml2js from 'xml2js';
import bgg from './bgg_util';

const { argv } = require('yargs')
  .demandCommand(1)
  .usage('Usage: $0 <command>')
  .command('sample_boardgames', 'Load sample board games data from boardgamegeek xml api2')
  .command('load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .example('$0 load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .help('help')
  .alias('h', 'help')
  .strict();

const command = argv._[0];

if (command === 'sample_boardgames') {
  const sampleGeeklistID = 1;
  request(`${config.get('boardgamegeek.api_url')}/geeklist/${sampleGeeklistID}`, (err, response, body) => {
    if (err) {
      throw err;
    }
    xml2js.parseString(body, (xmlErr, result) => {
      const boardGames = result.geeklist.item.filter(elm => elm.$.subtype === 'boardgame');
      const ids = boardGames.map(elm => elm.$.objectid);
      bgg.upsertBoardGamesFromIDs(ids);
    });
  });
} else if (command === 'load_boardgames') {
  // TODO: add throttling to preven 503 Service Unavailable
  const ids = Array(config.get('boardgamegeek.max_boardgame_id')).fill().map((e, i) => i + 1);
  bgg.upsertBoardGamesFromIDs(ids);
}

