import nock from 'nock';
import config from 'config';
import pg from 'pg';

import upsertBoardGamesFromIDs from '../../scripts/external_api/bgg_util';
import client from '../../src/util/database';


describe('external api - boardgamegeek', () => {
  test('board game upsert works', async () => {
    await client.query('BEGIN');
    nock('https://www.example.com')
      .get('/mocked_bgg_api/thing')
      .query({
        type: 'boardgame',
        id: 123,
        stats: 1,
        videos: 1,
      })
      .replyWithFile(200, 'fixtures/bgg_api_thing_boardgame.xml', { 'Content-Type': 'text/xml' });

    await upsertBoardGamesFromIDs([123]);

    const query = `SELECT id, name, slug, subtitle, description, review_video_id, age_restriction,
      players_number, playing_time, publisher_id, designer_id, difficulty, randomness,
      popularity, bgg_rating, bgg_id, year_published
    FROM boardgame WHERE bgg_id=123`;
    const result = await client.query(query);
    expect(result.rows[0].name).toBe('Samurai');
    await client.query('ROLLBACK');
  });
});