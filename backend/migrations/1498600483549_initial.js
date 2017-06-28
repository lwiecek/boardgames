exports.up = (pgm) => {
  pgm.createTable('publisher', {
    id: 'id',
    name: {type: 'text', notNull: true},
    website_uri: {type: 'text', notNull: true},
  });
  pgm.createTable('designer', {
    id: 'id',
    name: {type: 'text', notNull: true},
    website_uri: {type: 'text', notNull: true},
  });
  pgm.createTable('video', {
    id: 'id',
    uri: {type: 'text', notNull: true},
  });
  pgm.createTable('boardgame', {
    id: 'id',
    name: {type: 'text', notNull: true},
    slug: {type: 'text', notNull: true},
    subtitle: {type: 'text', notNull: true},
    description: {type: 'text', notNull: true},
    review_video_id: {type: 'integer', references: 'video'},
    age_restriction: {type: 'int4range'},
    players_number: {type: 'int4range'},
    publisher_id: {type: 'integer', references: 'publisher'},
    designer_id: {type: 'integer', references: 'designer'},
    difficulty: {type: 'integer'},
    randomness: {type: 'integer'},
    popularity: {type: 'integer'},
    bgg_rating: {type: 'numeric'},
  });
  pgm.createType('image_type', ['table', 'cover', 'box', 'photo'])
  pgm.createTable('image', {
    id: 'id',
    uri: {type: 'text', notNull: true},
    type: {type: 'image_type', notNull: true},
    boardgame_id: {type: 'integer', references: 'boardgame'},
  });
  pgm.createTable('instruction', {
    id: 'id',
    text_uri: {type: 'text', notNull: true},
    video_id: {type: 'integer', references: 'video'},
    boardgame_id: {type: 'integer', references: 'boardgame', notNull: true},
  });
};

exports.down = (pgm) => {
    pgm.dropTable('publisher');
    pgm.dropTable('designer');
    pgm.dropTable('video');
    pgm.dropTable('boardgame');
      pgm.dropType('image_type');
    pgm.dropTable('image');
    pgm.dropTable('instruction');
};
