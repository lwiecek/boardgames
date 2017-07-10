import config from 'config';
import pg from 'pg';
import SQL from 'sql-template-strings';

const pgConfig = {
  database: config.get('database.name'),
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(pgConfig);
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
  // There are four ways range can be returned from Postgres [a,b], (a,b), (a,b], [a,b)
  // However, this function always returns inclusive range [a,b]
  // slice to remove brackets
  const array = rangeString.slice(1, rangeString.length - 1).split(',');
  if (array[0] && rangeString[0] === '(') {
    array[0]++;
  }
  if (array[1] && rangeString[rangeString.length - 1] === ')') {
    array[1]--;
  }
  return { from: array[0] || null, to: array[1] || null };
}

function getInstructions(boardgameID) {
  const query = SQL`
    SELECT i.id, i.text_uri, v.id video_id, v.uri video_uri FROM instruction i
    LEFT OUTER JOIN video v ON (i.video_id = v.id)
    WHERE i.boardgame_id=${boardgameID}`;
  return pool.query(query).then((result) => {
    const instructions = [];
    for (let i = 0; i < result.rows.length; i++) {
      const instruction = Object.assign({}, result.rows[i]);
      if (instruction.video_id) {
        instruction.video = { id: instruction.video_id, uri: instruction.video_uri };
      }
      instructions.push(instruction);
    }
    return instructions;
  });
}

function getVideo(videoID) {
  const query = SQL`SELECT id, uri FROM video WHERE id=${videoID}`;
  return pool.query(query).then(result => result.rows[0]);
}

function boardgamesResolver(publisherID, designerID) {
  return (args) => {
    const fragments = [];
    const query = SQL`
      SELECT
        id, name, slug, subtitle, description, review_video_id, age_restriction,
        players_number, playing_time, publisher_id, designer_id, difficulty, randomness,
        popularity, bgg_rating
      FROM boardgame`;
    if (publisherID) {
      fragments.push(SQL`publisher_id=${publisherID}`);
    }
    if (designerID) {
      fragments.push(SQL`designer_id=${designerID}`);
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
      for (let i = 0; i < result.rows.length; i++) {
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
        boardgame.instructions = () => getInstructions(boardgame.id);
        if (boardgame.review_video_id) {
          boardgame.review_video = () => getVideo(boardgame.review_video_id);
        }
        if (boardgame.publisher_id) {
          // TODO: Below is causing N+1 queries.
          // Optimize by passing all board game ids.
          // Make the first resolve evalute it lazily.
          boardgame.publisher = () => publishersResolver(boardgame.publisher_id)().then(
            publishers => publishers[0]);
        }
        if (boardgame.designer_id) {
          // TODO: ditto
          boardgame.designer = () => designersResolver(boardgame.designer_id)().then(
            designers => designers[0]);
        }
        boardgames.push(boardgame);
      }
      return boardgames;
    });
  };
}

function designersResolver(designerID) {
  const query = SQL`SELECT id, name, website_uri FROM designer`;
  if (designerID) {
    query.append(SQL` WHERE id=${designerID}`);
  }
  return () => pool.query(query).then((result) => {
    const designers = [];
    for (let i = 0; i < result.rows.length; i++) {
      const designer = Object.assign({}, result.rows[i]);
      // TODO: Below is causing N+1 queries.
      // Optimize by passing all designer ids.
      // Make the first resolve evalute it lazily.
      designer.boardgames = boardgamesResolver(null, designer.id);
      designers.push(designer);
    }
    return designers;
  });
}

function publishersResolver(publisherID) {
  const query = SQL`SELECT id, name, website_uri FROM publisher`;
  if (publisherID) {
    query.append(SQL` WHERE id=${publisherID}`);
  }
  return () => pool.query(query).then((result) => {
    const publishers = [];
    for (let i = 0; i < result.rows.length; i++) {
      const publisher = Object.assign({}, result.rows[i]);
      // TODO: See designersResolver
      publisher.boardgames = boardgamesResolver(publisher.id, null);
      publishers.push(publisher);
    }
    return publishers;
  });
}

const root = {
  boardgames: boardgamesResolver(null, null),
  publishers: publishersResolver(null),
  designers: designersResolver(null),
};

export default root;
