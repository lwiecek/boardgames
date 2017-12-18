import request from 'supertest';

import app from '../src/index';
import client from '../src/util/database';


describe('publisher', () => {
  test('basic fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
      {
        query: `{
          publishers {
            id
            name
            website_uri
          }
        }`
      }
    ).expect(200, {
      'data': {
        'publishers': [
          {
            "website_uri": "http://cheapass.com/",
            "name": "Cheapass Games",
            "id": "1"
          }
        ]
      }
    }).expect('Content-Type', 'application/json; charset=utf-8');
    await client.query('ROLLBACK');
  });
  test('nested fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
      {
        query: `{
          publishers {
            boardgames {id, name}
          }
        }`
      }
    ).expect(200, {
      'data': {
        'publishers': [
          {
            'boardgames': [{
              'id': 1,
              'name': 'Tak',
            }],
          }
        ]
      }
    }).expect('Content-Type', 'application/json; charset=utf-8');
    await client.query('ROLLBACK');
  });
});