import request from 'supertest';
import config from 'config';
import pg from 'pg';

import app from '../src/index';
import client from '../src/util/database';

describe('boardgame', () => {
  // TODO TEST query board game with search terms
  // TODO TEST query board game using list of IDs
  test('basic fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
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
    }).expect('Content-Type', 'application/json; charset=utf-8');
    await client.query('ROLLBACK');
  });

  test('nested fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
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
    await client.query('ROLLBACK');
  });


  test('from to fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
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
    await client.query('ROLLBACK');
  });

  test('media fields work', async () => {
    await client.query('BEGIN');
    await request(app).post('/graphql').send(
      {
        query: `{
          boardgames {
            table_image { id uri }
            cover_image { id uri }
            box_image { id uri }
            instructions { id text_uri video { uri } }
            review_video { id uri }
            photos { id uri }
          }
        }`
      }
    ).expect(200, {
      'data': {
        'boardgames': [
          {
            'table_image': null,
            'cover_image': {
              'id': '2',
              'uri': 'http://example.com/cover-image.jpg'
            },
            'box_image': null,
            'instructions': [
              {
                'id': '1',
                'text_uri': 'http://example.com/text-instructions.pdf',
                'video': {
                  'uri': 'http://example.com/instructions-video.mp4'
                }
              },
              {
                'id': '2',
                'text_uri': 'http://example.com/text-instructions-different-language-no-video.pdf',
                'video': null
              }
            ],
            'review_video': {
              'id': '1',
              'uri': 'http://example.com/review-video.mp4'
            },
            'photos': [
              {
                'id': '1',
                'uri': 'http://example.com/tak-photo.jpg'
              }
            ]
          }
        ]
      }
    }).expect('Content-Type', 'application/json; charset=utf-8');
    await client.query('ROLLBACK');
  });
});