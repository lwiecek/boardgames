const request = require('supertest');
const app = require('../src/index').default;

describe('graphql', () => {
  test('basic boardgame fields should work', () => {
    return request(app).post('/graphql').send(
      {query: '{ boardgames { id, name, slug } }'}
    )
    .expect(200, {"data": {"boardgames": [{"id": "1", "name": "Tak", "slug": "tak"}]}})
    .expect('Content-Type', 'application/json; charset=utf-8');
  });
  // TODO
  // it('publisher fields should work', () => {
  //   expect(false).not.toBe(true);
  // });
  // it('designer fields should work', () => {
  //   expect(false).not.toBe(true);
  // });
});