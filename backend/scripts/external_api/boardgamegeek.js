#!/usr/bin/env node
'use strict';

const config = require('config');
const request = require('request');
const xml2js = require('xml2js');
const pg = require('pg');
const SQL = require('sql-template-strings').SQL;

const argv = require('yargs')
  .demandCommand(1)
  .usage('Usage: $0 <command>')
  .command('sample_boardgames', 'Load sample board games data from boardgamegeek xml api2')
  .command('load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .example('$0 load_boardgames', 'Load all board games data from boardgamegeek xml api2')
  .help('help')
  .alias('h', 'help')
  .strict()
  .argv;

const command = argv._[0];

const pgConfig = {
  database: config.get('database.name'),
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(pgConfig);
pool.on('error', err =>
  console.error('idle client error', err.message, err.stack),
);

function createOrUpdateBoardGame(id) {
  const details = `type=boardgame&id=${id}&stats=1&videos=1`;
  request(`${config.get('boardgamegeek.api_url')}/thing?${details}`, (err, response, body) => {
    if (err) {
      throw err;
    }
    xml2js.parseString(body, function (err, result) {
      const item = result.items.item[0];
      const value = (elm) => elm[0]['$'].value;
      // TODO: use the primary name
      const name = value(item.name);
      const slug = name;
      const description = item.description[0];
      const ageRestriction = `[${value(item.minage)},]`;
      const playersNumber = `[${value(item.minplayers)},${value(item.maxplayers)}]`;
      const playingTime = `[${value(item.minplaytime)},${value(item.maxplaytime)}]`;
      const yearPublished = value(item.yearpublished);
      // TODO: INSERT OR UPDATE
      // TODO: BGG rating
      const query = SQL`
        INSERT INTO boardgame(
          name,
          slug,
          subtitle,
          description,
          age_restriction,
          players_number,
          playing_time,
          year_published,
          bgg_id
        ) VALUES (
          ${name},
          ${slug},
          '',
          ${description},
          ${ageRestriction},
          ${playersNumber},
          ${playingTime},
          ${yearPublished},
          ${id}
        )
        RETURNING id;`;
      return pool.query(query).then((result) => {
        const imageUri = item.image[0];
        const boardgameID = result.rows[0].id;
        // TODO: INSERT OR UPDATE
        const queryImage = SQL`
          INSERT INTO image(
            uri,
            type,
            boardgame_id
          ) VALUES (
            ${imageUri},
            'box',
            ${boardgameID}
          )
        `;
        return pool.query(queryImage);
      });
      // TODO: add videos
      // TODO: add publishers
    });
  });
}

if (command === 'sample_boardgames') {
  const sampleGeeklistID = 1;
  request(`${config.get('boardgamegeek.api_url')}/geeklist/${sampleGeeklistID}`, (err, response, body) => {
    if (err) {
      throw err;
    }
    xml2js.parseString(body, function (err, result) {
      for (let item of result.geeklist.item) {
        if (item['$'].subtype === 'boardgame') {
          createOrUpdateBoardGame(item['$'].objectid)
        }
      }
    });
  });
} else if (command === 'load_boardgames') {

}