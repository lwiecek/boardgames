INSERT INTO publisher(name, website_uri) VALUES ('Cheapass Games', 'http://cheapass.com/');
INSERT INTO boardgame(name, slug, subtitle, description, publisher_id) VALUES (
    'Tak', 'tak', 'A Beautiful Game', '', (SELECT id FROM publisher where name = 'Cheapass Games'));
