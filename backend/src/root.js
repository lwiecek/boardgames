import pg from 'pg';
import SQL from 'sql-template-strings';

const config = {
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
pool.on('error', err =>
  console.error('idle client error', err.message, err.stack),
);


class Images {
  constructor(boardgameID) {
    this.boardgameID = boardgameID;
  }
  get() {
    if (this.result) {
      return this.result;
    }
    const query = SQL`SELECT id, uri, type FROM image WHERE boardgame_id=${this.boardgameID}`;
    this.result = pool.query(query).then(result => result.rows);
    return this.result;
  }
  getByType(type) {
    return this.get().then(imgs => imgs.filter(img => img.type === type));
  }
}

function parseIntRange(rangeString) {
  // slice to remove brackets
  const array = rangeString.slice(1, rangeString.length - 1).split(',');
  return { from: array[0] || null, to: array[1] || null };
}

function boardgamesResolver(publisherID, designerID) {
  return (args) => {
    const fragments = [];
    const query = SQL`SELECT * FROM boardgame`;
    if (publisherID) {
      fragments.push(SQL`publisher_id=${publisherID}`);
    }
    if (designerID) {
      fragments.push(SQL`designer_id=${publisherID}`);
    }
    if (args.search) {
      const search = `%${args.search}%`;
      fragments.push(SQL`name ILIKE ${search}`);
    }
    if (args.ids) {
      fragments.push(SQL`id = ANY(${args.ids}::int[])`);
    }

    if (fragments.length > 0) {
      query.append(SQL` WHERE `);
      fragments.forEach((val, idx) => {
        if (idx > 0) {
          query.append(SQL` AND `);
        }
        query.append(val);
      });
    }
    return pool.query(query).then((result) => {
      const boardgames = [];
      for (let i = 0; i < result.rows.length; i += 1) {
        const boardgame = Object.assign({}, result.rows[i]);
        const images = new Images(boardgame.id);
        boardgame.photos = images.getByType('photo');
        boardgame.cover_image = images.getByType('cover').then(imgs => imgs[0]);
        boardgame.box_image = images.getByType('box').then(imgs => imgs[0]);
        boardgame.table_image = images.getByType('table').then(imgs => imgs[0]);
        boardgame.age_restriction = parseIntRange(boardgame.age_restriction);
        boardgame.players_number = parseIntRange(boardgame.players_number);
        boardgame.playing_time = parseIntRange(boardgame.playing_time);
        boardgame.bgg_rating = boardgame.bgg_rating || '';
        if (boardgame.publisher_id) {
          // TODO: Below is causing N+1 queries.
          // Optimize by passing all board game ids.
          // Make the first resolve evalute it lazily.
          boardgame.publisher = () => publishersResolver(boardgame.publisher_id)().then(
            publishers => publishers[0]);
        }
        boardgames.push(boardgame);
      }
      return boardgames;
    });
  };
}

function publishersResolver(publisherID) {
  const query = SQL`SELECT id, name, website_uri FROM publisher`;
  if (publisherID) {
    query.append(SQL` WHERE id=${publisherID}`);
  }
  return () => pool.query(query).then((result) => {
    const publishers = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const publisher = Object.assign({}, result.rows[i]);
      // TODO: Below is causing N+1 queries.
      // Optimize by passing all publisher ids.
      // Make the first resolve evalute it lazily.
      publisher.boardgames = boardgamesResolver(publisher.id, null);
      publishers.push(publisher);
    }
    return publishers;
  });
}

const root = {
  boardgames: boardgamesResolver(null, null),
  publishers: publishersResolver(null),
};

export default root;
