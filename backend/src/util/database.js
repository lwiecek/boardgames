import config from 'config';
import pg from 'pg';

const pgConfig = { database: config.database.name };

let client;

if (config.ENV === 'test') {
  // This is done to allow wrapping test cases in database transaction
  client = new pg.Client(pgConfig);
  client.connect();
} else {
  // Wow long a client is allowed to remain idle before being closed
  pgConfig.idleTimeoutMillis = 30000;
  // Max number of clients in the pool
  pgConfig.max = 10;
  client = new pg.Pool(pgConfig);
  client.on('error', err => console.error('idle client error', err.message, err.stack));
}

const exportedClient = client;

export default exportedClient;
