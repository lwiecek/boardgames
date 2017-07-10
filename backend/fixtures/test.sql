BEGIN;

INSERT INTO publisher(name, website_uri) VALUES ('Cheapass Games', 'http://cheapass.com/');
INSERT INTO video(uri) VALUES ('http://example.com/review-video.mp4');
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
  (SELECT id FROM video WHERE uri = 'http://example.com/review-video.mp4')
);

INSERT INTO image(uri, type, boardgame_id) VALUES (
  'http://example.com/tak-photo.jpg',
  'photo',
  (SELECT id FROM boardgame WHERE name = 'Tak')
);
INSERT INTO image(uri, type, boardgame_id) VALUES (
  'http://example.com/cover-image.jpg',
  'cover',
  (SELECT id FROM boardgame WHERE name = 'Tak')
);
INSERT INTO video(uri) VALUES ('http://example.com/instructions-video.mp4');
INSERT INTO instruction(text_uri, video_id, boardgame_id) VALUES (
  'http://example.com/text-instructions.pdf',
  (SELECT id FROM video WHERE uri='http://example.com/instructions-video.mp4'),
  (SELECT id FROM boardgame WHERE name='Tak')
);
INSERT INTO instruction(text_uri, boardgame_id) VALUES (
  'http://example.com/text-instructions-different-language-no-video.pdf',
  (SELECT id FROM boardgame WHERE name='Tak')
);

COMMIT;