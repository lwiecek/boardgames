import config from 'config';
import pg from 'pg';

// FIXME Temporarily turned off due to testing of sample BGG data
// in development database, uncomment once I am happy with the initial data
// if (process.env.NODE_ENV !== 'test') {
//   console.log('database recreation is only allowed in test environment');
//   process.exit(1);
// }

const client = new pg.Client({
  // use this database for connection purposes, boardgames may be missing
  database: 'postgres',
});
const dbName = config.database.name;

async function recreate() {
  try {
    await client.connect();
    // Remove all connections to the test database - required before DROP
    await client.query(
      'SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname=$1',
      [dbName],
    );
    console.log(`dropping database ${dbName}`);
    await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`creating database ${dbName}`);
    await client.query(`CREATE DATABASE ${dbName}`);
    await client.end();
    console.log('SUCCESS');
  } catch (err) {
    console.log('FAILURE');
    console.error(err);
    process.exit(1);
  }
}

recreate();
