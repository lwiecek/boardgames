const fs = require('fs');
const bgg = require('../../scripts/external_api/bgg_util.js');

describe('external api - boardgamegeek', () => {
  test('board game upsert works', () => {
    let ticks = 0;
    return new Promise((resolve, reject) => {
      fs.readFile('fixtures/bgg_api_thing_boardgame.xml', (err, data) => {
        expect(err).toBe(null);
        const bar = {tick: () => ++ticks};
        bgg.parseBoardGameXML(3, bar, data, resolve, reject)
      });
    }).then(resolve => expect(ticks).toBe(1));
  });
});