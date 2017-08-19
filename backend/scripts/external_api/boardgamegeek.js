#!/usr/bin/env node
'use strict';

const config = require('config');
const request = require('request');
const xml2js = require('xml2js');
const pg = require('pg');
const SQL = require('sql-template-strings').SQL;
const slugify = require('slugify');
const ProgressBar = require('progress');

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

function createOrUpdateBoardGame(id, bar) {
  const details = `type=boardgame&id=${id}&stats=1&videos=1`;
  request(`${config.get('boardgamegeek.api_url')}/thing?${details}`, (err, response, body) => {
    if (err) {
      throw err;
    }
    xml2js.parseString(body, function (err, result) {
      const item = result.items.item[0];
      const value = (elements) => elements[0]['$'].value;
      const getPrimaryName = (elements) => {
        return elements.filter(elm => elm['$'].type === 'primary')[0]['$'].value;
      }
      const name = getPrimaryName(item.name);
      const slug = slugify(name, {lower: true});
      const description = item.description[0];
      const ageRestriction = `[${value(item.minage)},]`;
      const playersNumber = `[${value(item.minplayers)},${value(item.maxplayers)}]`;
      const playingTime = `[${value(item.minplaytime)},${value(item.maxplaytime)}]`;
      const yearPublished = value(item.yearpublished);
      const bggRating = value(item.statistics[0].ratings[0].average);
      // Upsert with more than one unique key (slug, bbg_id) in Postgres is hard.
      // Ignoring conflicting games with ON CONFLICT DO NOTHING,
      // easier to delete them and recreate in case of edits.
      // See: https://stackoverflow.com/questions/1109061/insert-on-duplicate-update-in-postgresql
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
          bgg_id,
          bgg_rating
        ) VALUES (
          ${name},
          ${slug},
          '',
          ${description},
          ${ageRestriction},
          ${playersNumber},
          ${playingTime},
          ${yearPublished},
          ${id},
          ${bggRating}
        )
        ON CONFLICT DO NOTHING
        RETURNING id;
      `;
      // TODO refactor with Promise.all ?
      // TODO use async / await ?
      return pool.query(query).then((result) => {
        if (!result.rows.length) {
          return;
        }
        const imageUri = item.image[0];
        const boardGameID = result.rows[0].id;
        // Skiping duplicates with ON CONFLICT DO NOTHING
        const queryImage = SQL`
          INSERT INTO image(
            uri,
            type,
            boardgame_id
          ) VALUES (
            ${imageUri},
            'box',
            ${boardGameID}
          )
          ON CONFLICT DO NOTHING;
        `;
        return pool.query(queryImage).then(() => boardGameID);
      }).then((boardGameID) => {
        console.log(boardGameID);
        if (!item.videos[0].video) {
          return;
        }
        const videos = item.videos[0].video.filter(elm =>
          elm['$'].language === config.get('boardgamegeek.language'));
        const instructions = videos.filter(elm =>
          elm['$'].category === 'instructional');
        const reviews = videos.filter(elm =>
          elm['$'].category === 'review');
        if (reviews.length) {
          // console.log(reviews);
          // TODO: pick the one with the latest postdate?
          const reviewVideoUri = reviews[0]['$'].link;
          const queryVideo = SQL`
            INSERT INTO video(uri)
            VALUES (${reviewVideoUri})
            ON CONFLICT DO NOTHING
            RETURNING id;
          `;
          return pool.query(queryVideo).then((result) => {
            if (!result.rows.length) {
              return;
            }
            const reviewVideoID = result.rows[0].id;
            // console.log(reviewVideoID);
            // console.log(boardGameID);
            const queryUpdateBoardgame = SQL`
              UPDATE boardgame
              SET review_video_id=${reviewVideoID}
              WHERE id=${boardGameID}
            `;
            return pool.query(queryUpdateBoardgame);
          });
        }
      }).then(() => bar.tick());

      // TODO: add publishers
      // TODO: add designer
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
      const boardGames = result.geeklist.item.filter(elm => elm['$'].subtype === 'boardgame');
      const bar = new ProgressBar('loading sample board games [:bar] :percent (:current/:total) :etas', {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: boardGames.length
      });
      for (let item of boardGames) {
        createOrUpdateBoardGame(item['$'].objectid, bar);
      }
    });
  });
} else if (command === 'load_boardgames') {
  // TODO: determine range of board game ids somehow
}