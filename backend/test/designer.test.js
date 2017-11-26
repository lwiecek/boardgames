const request = require('supertest');
const app = require('../src/index').default;

describe('designer', () => {
  test('basic fields work', () => {
    return request(app).post('/graphql').send(
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
  });
  test('nested fields work', () => {
    return request(app).post('/graphql').send(
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
  });
});