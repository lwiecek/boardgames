'use strict';

const config = require('config');
const request = require('request');
const xml2js = require('xml2js');
const SQL = require('sql-template-strings').SQL;
const slugify = require('slugify');
const pg = require('pg');
const ProgressBar = require('progress');

const pgConfig = {
  database: config.get('database.name'),
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(pgConfig);
pool.on('error', err =>
  console.error('idle client error', err.message, err.stack),
);

function getID(result) {
  return !result.rows.length ? null : result.rows[0].id;
}

function processReviewsXML(boardGameID, reviews) {
  if (!reviews.length) {
    return Promise.resolve();
  }
  // TODO: pick the one with the latest postdate?
  const reviewVideoUri = reviews[0]['$'].link;
  const queryVideo = SQL`
    INSERT INTO video(uri)
    VALUES (${reviewVideoUri})
    ON CONFLICT DO NOTHING
    RETURNING id;
  `;
  return pool.query(queryVideo).then((result) => {
    const reviewVideoID = getID(result);
    if (!reviewVideoID) {
      return Promise.resolve();
    }
    const queryUpdateBoardgame = SQL`
      UPDATE boardgame
      SET review_video_id=${reviewVideoID}
      WHERE id=${boardGameID}
    `;
    return pool.query(queryUpdateBoardgame);
  });
}

function processInstructionsXML(boardGameID, instructions) {
  if (!instructions.length) {
    return Promise.resolve();
  }
  // TODO: pick the one with the latest postdate?
  const instructionVideoUri = instructions[0]['$'].link;
  const queryInstructionVideo = SQL`
    INSERT INTO video(uri)
    VALUES (${instructionVideoUri})
    ON CONFLICT DO NOTHING
    RETURNING id;
  `;
  return pool.query(queryInstructionVideo).then(result => {
    const videoID = getID(result);
    if (!videoID) {
      return Promise.resolve();
    }
    const queryInstruction = SQL`
      INSERT INTO instruction(text_uri, video_id, boardgame_id)
      VALUES ('', ${videoID}, ${boardGameID})
      ON CONFLICT DO NOTHING;
    `;
    return pool.query(queryInstruction);
  });
}

function processImagesXML(item, boardGameID) {
  // assumes exactly one image exists
  // and that it's box image
  const imageUri = item.image[0];
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
  return pool.query(queryImage);
}

function processVideosXML(item, boardGameID) {
  if (!item.videos[0].video) {
    return Promise.resolve();
  }
  const videos = item.videos[0].video.filter(elm =>
    elm['$'].language === config.get('boardgamegeek.language'));
  const reviews = videos.filter(elm => elm['$'].category === 'review');
  const instructions = videos.filter(elm => elm['$'].category === 'instructional');
  return Promise.all([
    processReviewsXML(boardGameID, reviews),
    processInstructionsXML(boardGameID, instructions)
  ]);
}

function processBoardGameXML(bggID, result) {
  if (!result.items || !result.items.item) {
    // Some board game ids return nothing
    return Promise.reject(`Missing boardgame data, bggID: ${bggID}`);
  }
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
      ${bggID},
      ${bggRating}
    )
    ON CONFLICT DO NOTHING
    RETURNING id;
  `;
  // TODO refactor with Promise.all ?
  // TODO use async / await ?
  return pool.query(query).then(result => {
    const boardGameID = getID(result);
    if (!boardGameID) {
      return Promise.resolve();
    }
    return Promise.all([
      processImagesXML(item, boardGameID),
      processVideosXML(item, boardGameID)
    ]);
  });
  // TODO: add publishers
  // TODO: add designer
}

// exported for testing purposes
module.exports.parseBoardGameXML = function parseBoardGameXML(id, bar, body, resolve, reject) {
  return xml2js.parseString(body, (err, result) => {
    if (err) {
      throw err;
    }
    processBoardGameXML(id, result)
      .then(() => resolve(bar.tick()))
      .catch((reason) => reject(reason));
  });
}

function upsertBoardGame(bggID, bar) {
  return new Promise((resolve, reject) => {
    const details = `type=boardgame&id=${bggID}&stats=1&videos=1`;
    request(`${config.get('boardgamegeek.api_url')}/thing?${details}`, (err, response, body) => {
      if (err) {
        throw err;
      }
      if (response.statusCode !== 200) {
        reject(`Failed board game response: ${response.statusCode}, bggID: ${bggID}`);
      }
      parseBoardGameXML(bggID, bar, body, resolve, reject);
    });
  });
}

module.exports.upsertBoardGamesFromIDs = function upsertBoardGamesFromIDs(ids) {
  const bar = new ProgressBar('loading board games [:bar] :percent (:current/:total) :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: ids.length
  });
  let lazyPromises = [];
  for (let id of ids) {
    lazyPromises.push(() => upsertBoardGame(id, bar));
  }
  let delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));
  lazyPromises.reduce(
    (prev, curr) => {
      return prev
        .then(delay(config.get('boardgamegeek.requests_delay_in_ms')))
        .then(curr)
        .catch(reason => console.log(reason));
    },
    Promise.resolve()
  );
}
