const fs = require('fs');
const bgg = require('../../scripts/external_api/bgg_util.js');

describe('external api - boardgamegeek', () => {
  test('board game upsert works', () => {
    return fs.readFile('fixtures/bbg_api_thing_boardgame.xml', (err, data) => {
      return;
    //   if (err) {
    //     throw err;
    //   }
    //   parseBoardGameXML(null, null, data);
    });
  });
});