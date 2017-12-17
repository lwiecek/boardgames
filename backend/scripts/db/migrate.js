import config from 'config';
import childProcess from 'child_process';

const spawn = childProcess.spawnSync;

const dbUsername = config.database.username;
const dbPassword = config.database.password;
const dbHost = config.database.host;
const dbName = config.database.name;

console.log(`migrating database ${dbName}`);
const env = Object.create(process.env);
env.DATABASE_URL = `postgres://${dbUsername}:${dbPassword}@${dbHost}/${dbName}`;

const pgMigrate = spawn('./node_modules/.bin/node-pg-migrate', ['up'], { env });
console.log(`stderr: ${pgMigrate.stderr.toString()}`);
console.log(`stdout: ${pgMigrate.stdout.toString()}`);
