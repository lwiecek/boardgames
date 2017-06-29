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

const boardgamesResolver = (publisherID, designerID) => (args) => {
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
  return pool.query(query).then(result => result.rows);
};

const root = {
  boardgames: boardgamesResolver(null, null),
  publishers: () => pool.query(SQL`SELECT id, name, website_uri FROM publisher`).then((result) => {
    const publishers = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const publisher = Object.assign({}, result.rows[i]);
      publisher.boardgames = boardgamesResolver(publisher.id, null);
      publishers.push(publisher);
    }
    return publishers;
  }),
};

export default root;
