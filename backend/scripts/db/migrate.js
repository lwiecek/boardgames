import config from 'config';
import childProcess from 'child_process';

const spawn = childProcess.spawnSync;

const dbUsername = config.get('database.username');
const dbPassword = config.get('database.password');
const dbHost = config.get('database.host');
const dbName = config.get('database.name');

console.log(`migrating database ${dbName}`);
const env = Object.create(process.env);
env.DATABASE_URL = `postgres://${dbUsername}:${dbPassword}@${dbHost}/${dbName}`;

const pgMigrate = spawn('./node_modules/.bin/node-pg-migrate', ['up'], { env });
console.log(`stderr: ${pgMigrate.stderr.toString()}`);
console.log(`stdout: ${pgMigrate.stdout.toString()}`);
