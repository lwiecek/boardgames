import nock from 'nock';
import config from 'config';
import pg from 'pg';

import { upsertBoardGamesFromIDs } from '../../scripts/external_api/bgg_util';
import client from '../../src/util/database';


describe('external api - boardgamegeek', () => {
  test('board game upsert works', async () => {
    // TODO automatically wrap tests in transaction
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
    expect(result.rows.length).toBe(1);
    expect(result.rows[0]).toEqual({
      age_restriction: '[10,)',
      bgg_id: 123,
      bgg_rating: '7.43899',
      description: 'Part of the Knizia tile-laying trilogy, Samurai is set in medieval Japan. Players compete to gain the favor of three factions: samurai, peasants, and priests, which are represented by helmet, rice paddy, and Buddha tokens scattered about the board, which features the islands of Japan. The competition is waged through the use of hexagonal tiles, each of which help curry favor of one of the three factions &mdash; or all three at once! Players can make lightning-quick strikes with horseback ronin and ships or approach their conquests more methodically. As each token (helmets, rice paddies, and Buddhas) is surrounded, it is awarded to the player who has gained the most favor with the corresponding group.&#10;&#10;Gameplay continues until all the symbols of one type have been removed from the board or four tokens have been removed from play due to a tie for influence.&#10;&#10;At the end of the game, players compare captured symbols of each type, competing for majorities in each of the three types. Ties are not uncommon and are broken based on the number of other, &quot;non-majority&quot; symbols each player has collected.&#10;&#10;',
      designer_id: null,
      difficulty: null,
      id: 2,
      name: 'Samurai',
      players_number: '[2,5)',
      playing_time: '[30,61)',
      popularity: null,
      publisher_id: null,
      randomness: null,
      review_video_id: 3,
      slug: 'samurai',
      subtitle: '',
      year_published: 1998,
    });
    await client.query('ROLLBACK');
  });
});