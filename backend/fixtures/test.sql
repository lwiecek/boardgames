INSERT INTO publisher(name, website_uri) VALUES ('Cheapass Games', 'http://cheapass.com/');
INSERT INTO boardgame(name, slug, subtitle, description, publisher_id) VALUES (
    'Tak', 'tak', 'A Beautiful Game', '', (SELECT id FROM publisher where name = 'Cheapass Games'));
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
