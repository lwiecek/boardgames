INSERT INTO publisher(name, website_uri) VALUES ('Cheapass Games', 'http://cheapass.com/');
INSERT INTO video(uri) VALUES ('http://example.com/review-video');
INSERT INTO boardgame(
  name,
  slug,
  subtitle,
  description,
  age_restriction,
  players_number,
  playing_time,
  publisher_id,
  review_video_id
) VALUES (
  'Tak',
  'tak',
  'A Beautiful Game',
  '',
  '[12,]',
  '[2,2]',
  '[10,]',
  (SELECT id FROM publisher WHERE name = 'Cheapass Games'),
  (SELECT id FROM video WHERE uri = 'http://example.com/review-video')
);

INSERT INTO image(uri, type, boardgame_id) VALUES (
  'https://www.boardgameprices.com/articleimage?p=uploads/2015/07/Bgg-Con.jpg',
  'photo',
  (SELECT id FROM boardgame WHERE name = 'Tak')
);
INSERT INTO image(uri, type, boardgame_id) VALUES (
  'https://images.pexels.com/photos/209640/pexels-photo-209640.jpeg',
  'cover',
  (SELECT id FROM boardgame WHERE name = 'Tak')
);
INSERT INTO video(uri) VALUES ('http://example.com/instructions-video');
INSERT INTO instruction(text_uri, video_id, boardgame_id) VALUES (
  'http://example.com/text-instructions',
  (SELECT id FROM video WHERE uri='http://example.com/instructions-video'),
  (SELECT id FROM boardgame WHERE name='Tak')
);
INSERT INTO instruction(text_uri, boardgame_id) VALUES (
  'http://example.com/text-instructions-different-language-no-video',
  (SELECT id FROM boardgame WHERE name='Tak')
);