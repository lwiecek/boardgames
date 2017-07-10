const request = require('supertest');
const app = require('../src/index').default;

describe('boardgame', () => {
  test('basic fields work', () => {
    return request(app).post('/graphql').send(
      {
        query: `{
          boardgames {
            id
            name
            slug
            subtitle
            description
            difficulty
            randomness
            popularity
            bgg_rating
          }
        }`
      }
    ).expect(200, {
      'data': {
        'boardgames': [
          {
            'id': '1',
            'name': 'Tak',
            'slug': 'tak',
            'subtitle': 'A Beautiful Game',
            'description': '',
            'difficulty': null,
            'randomness': null,
            'popularity': null,
            'bgg_rating': '',
          }
        ]
      }
    }).expect('Content-Type', 'application/json; charset=utf-8')
  });

  test('nested fields work', () => {
    return request(app).post('/graphql').send(
      {
        query: `{
          boardgames {
            publisher {id, name}
            designer {id}
          }
        }`
      }
    ).expect(200, {
      'data': {
        'boardgames': [
          {
            'publisher': {
              'id': 1,
              'name': 'Cheapass Games',
            },
            'designer': null,
          }
        ]
      }
    }).expect('Content-Type', 'application/json; charset=utf-8');
  });

  test('from to fields work', () => {
    return request(app).post('/graphql').send(
      {
        query: `{
          boardgames {
            age_restriction {from to}
            players_number {from to}
            playing_time {from to}
          }
        }`
      }
    ).expect(200, {
      'data': {
        'boardgames': [
          {
            'age_restriction': {'from': 12, 'to': null},
            'players_number': {'from': 2, 'to': 2},
            'playing_time': {'from': 10, 'to': null},
          }
        ]
      }
    }).expect('Content-Type', 'application/json; charset=utf-8');
  });
});