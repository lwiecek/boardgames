import pg from 'pg';

const config = {
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
pool.on('error', err =>
  console.error('idle client error', err.message, err.stack),
);

const fragmentsValues = (fragments, values) => {
  let idx = 0;
  return (name, id) => {
    if (id) {
      idx += 1;
      fragments.push(`${name}=$${idx}`);
      values.push(id);
    }
  };
};

const boardgamesResolver = (publisherID, desginerID) => () => {
  const fragments = [];
  const values = [];
  const update = fragmentsValues(fragments, values);
  update('publisher_id', publisherID);
  update('designer_id', desginerID);
  let query = 'SELECT * FROM boardgame';
  if (values) {
    query += ` WHERE ${fragments.join(' AND ')}`;
  }
  return pool.query(query, values).then(result => result.rows);
};

const root = {
  boardgames: () => [],
  publishers: () => pool.query('SELECT id, name, website_uri FROM publisher').then((result) => {
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
