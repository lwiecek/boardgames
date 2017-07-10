const request = require('supertest');
const app = require('../src/index').default;

describe('boardgame', () => {
  test('basic fields work', () => {
    return request(app).post('/graphql').send(
      {query: '{ boardgames { id, name, slug } }'}
    )
    .expect(200, {"data": {"boardgames": [{"id": "1", "name": "Tak", "slug": "tak"}]}})
    .expect('Content-Type', 'application/json; charset=utf-8')
  });

  test('nested fields work', () => {
    return request(app).post('/graphql').send(
      {query: '{ boardgames { publisher {id, name} designer {id} } }'}
    )
    .expect(200, {
      "data": {
        "boardgames": [
          {
            "publisher": {
              'id': 1,
              'name': 'Cheapass Games',
            },
            "designer": null,
          }
        ]
      }
    })
    .expect('Content-Type', 'application/json; charset=utf-8');
  });
});