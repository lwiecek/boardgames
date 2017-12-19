import { promisify } from 'util';
import config from 'config';
import request from 'superagent';
import xml2js from 'xml2js';
import { SQL } from 'sql-template-strings';
import slugify from 'slugify';
import ProgressBar from 'progress';

import pool from '../../src/util/database';

const xml2jsParseString = promisify(xml2js.parseString);

function getID(result) {
  return !result.rows.length ? null : result.rows[0].id;
}

async function processReviewsXML(boardGameID, reviews) {
  if (!reviews.length) {
    return;
  }
  // TODO: pick the one with the latest postdate?
  const reviewVideoUri = reviews[0].$.link;
  const queryVideo = SQL`
    INSERT INTO video(uri)
    VALUES (${reviewVideoUri})
    ON CONFLICT DO NOTHING
    RETURNING id;
  `;
  const reviewVideoID = getID(await pool.query(queryVideo));
  if (!reviewVideoID) {
    return;
  }
  const queryUpdateBoardgame = SQL`
    UPDATE boardgame
    SET review_video_id=${reviewVideoID}
    WHERE id=${boardGameID}
  `;
  await pool.query(queryUpdateBoardgame);
}

async function processInstructionsXML(boardGameID, instructions) {
  if (!instructions.length) {
    return;
  }
  // TODO: pick the one with the latest postdate?
  const instructionVideoUri = instructions[0].$.link;
  const queryInstructionVideo = SQL`
    INSERT INTO video(uri)
    VALUES (${instructionVideoUri})
    ON CONFLICT DO NOTHING
    RETURNING id;
  `;
  const videoID = getID(await pool.query(queryInstructionVideo));
  if (!videoID) {
    return;
  }
  const queryInstruction = SQL`
    INSERT INTO instruction(text_uri, video_id, boardgame_id)
    VALUES ('', ${videoID}, ${boardGameID})
    ON CONFLICT DO NOTHING;
  `;
  await pool.query(queryInstruction);
}

async function processImagesXML(item, boardGameID) {
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
  await pool.query(queryImage);
}

async function processVideosXML(item, boardGameID) {
  if (!item.videos[0].video) {
    return;
  }
  const videos = item.videos[0].video.filter(elm =>
    elm.$.language === config.boardgamegeek.language);
  const reviews = videos.filter(elm => elm.$.category === 'review');
  const instructions = videos.filter(elm => elm.$.category === 'instructional');
  await processReviewsXML(boardGameID, reviews);
  await processInstructionsXML(boardGameID, instructions);
}

async function processBoardGameXML(bggID, result) {
  if (!result.items || !result.items.item) {
    // Some board game ids return nothing
    throw new Error(`Missing boardgame data, bggID: ${bggID}`);
  }
  const item = result.items.item[0];
  const value = elements => elements[0].$.value;
  const getPrimaryName = elements => elements.filter(elm => elm.$.type === 'primary')[0].$.value;
  const name = getPrimaryName(item.name);
  const slug = slugify(name, { lower: true });
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
  const boardGameID = getID(await pool.query(query));
  if (!boardGameID) {
    return;
  }
  await processImagesXML(item, boardGameID);
  await processVideosXML(item, boardGameID);
  // TODO: add publishers
  // TODO: add designer
}

async function upsertBoardGame(bggID, bar) {
  const response = await request.get(`${config.boardgamegeek.api_url}/thing`).query({
    type: 'boardgame',
    id: bggID,
    stats: 1,
    videos: 1,
  });
  if (response.statusCode !== 200) {
    throw new Error(`Failed board game response: ${response.statusCode}, bggID: ${bggID}`);
  }
  const result = await xml2jsParseString(response.text);
  await processBoardGameXML(bggID, result);
  bar.tick();
}

async function sleep(miliseconds) {
  return new Promise(resolve => setTimeout(resolve, miliseconds));
}

async function upsertBoardGamesFromIDs(ids) {
  const bar = new ProgressBar('loading board games [:bar] :percent (:current/:total) :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: ids.length,
  });
  for (let i = 0; i < ids.length; i += 1) {
    const id = ids[i];
    try {
      // TODO implement real rate limiting
      // await in a for loop is fine in this case
      // since this needs to run sequentially due to rate limiting
      // eslint-disable-next-line no-await-in-loop
      await sleep(config.boardgamegeek.requests_delay_in_ms);
      // eslint-disable-next-line no-await-in-loop
      await upsertBoardGame(id, bar);
    } catch (err) {
      console.error(err);
    }
  }
}

export { upsertBoardGamesFromIDs, sleep };
