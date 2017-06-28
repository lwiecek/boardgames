import pg from 'pg';

const config = {
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);
pool.on('error', err =>
  console.error('idle client error', err.message, err.stack),
);

const root = {
  boardgames: () => [],
  publishers: () => pool.query('SELECT * FROM publisher').then(result => result.rows),
};

export default root;
