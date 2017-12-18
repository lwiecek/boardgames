import request from 'supertest';
import app from '../src/index';
import client from '../src/util/database';

describe('designer', () => {
  test('basic fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
      {
        query: `{
          designers {
            id
            name
            website_uri
          }
        }`
      }
    ).expect(200, {
      'data': {
        'designers': []
      }
    }).expect('Content-Type', 'application/json; charset=utf-8');
    await client.query('ROLLBACK');
  });
  test('nested fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
      {
        query: `{
          designers {
            boardgames {id, name}
          }
        }`
      }
    ).expect(200, {
      'data': {
        'designers': []
      }
    }).expect('Content-Type', 'application/json; charset=utf-8');
    await client.query('ROLLBACK');
  });
});