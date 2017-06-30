INSERT INTO publisher(name, website_uri) VALUES ('Cheapass Games', 'http://cheapass.com/');
INSERT INTO boardgame(
  name,
  slug,
  subtitle,
  description,
  age_restriction,
  players_number,
  playing_time,
  publisher_id
) VALUES (
  'Tak',
  'tak',
  'A Beautiful Game',
  '',
  '[12,]',
  '[2,2]',
  '[10,]',
  (SELECT id FROM publisher where name = 'Cheapass Games')
);

INSERT INTO image(uri, type, boardgame_id) VALUES (
  'https://www.boardgameprices.com/articleimage?p=uploads/2015/07/Bgg-Con.jpg',
  'photo',
  (SELECT id FROM boardgame where name = 'Tak')
);
INSERT INTO image(uri, type, boardgame_id) VALUES (
  'https://images.pexels.com/photos/209640/pexels-photo-209640.jpeg',
  'cover',
  (SELECT id FROM boardgame where name = 'Tak')
);
