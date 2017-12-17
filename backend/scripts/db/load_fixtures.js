import config from 'config';
import pg from 'pg';
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

const dbName = config.database.name;
const pgConfig = {
  database: dbName,
};
const client = new pg.Client(pgConfig);

if (process.env.NODE_ENV !== 'test') {
  console.log('loading fixtures is only allowed in test environment');
  process.exit(1);
}

async function loadFixtures() {
  try {
    console.log(`loading fixtures in ${dbName}`);
    const data = await readFileAsync('fixtures/test.sql', 'utf8');
    await client.connect();
    await client.query(data);
    await client.end();
    console.log('SUCCESS');
  } catch (err) {
    console.log('FAILURE');
    console.error(err);
    process.exit(1);
  }
}

loadFixtures();
