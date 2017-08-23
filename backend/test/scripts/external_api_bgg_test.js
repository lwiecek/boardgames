const fs = require('fs');
const bgg = require('../../scripts/external_api/bgg_util.js');

describe('external api - boardgamegeek', () => {
  test('board game upsert works', done => {
    fs.readFile('fixtures/bgg_api_thing_boardgame.xml', (err, data) => {
      expect(err).toBe(null);
      const resolve = () => null;
      const reject = () => null;
      const bar = {tick: () => null};
      bgg.parseBoardGameXML(3, bar, data, resolve, reject);
      done();
    });
  });
});