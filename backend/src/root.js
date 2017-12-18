// @flow

import SQL from 'sql-template-strings';
import pool from '../src/util/database';

function parseIntRange(rangeString) {
  // There are four ways range can be returned from Postgres [a,b], (a,b), (a,b], [a,b)
  // However, this function always returns inclusive range [a,b]
  // slice to remove brackets
  const array = rangeString.slice(1, rangeString.length - 1).split(',');
  if (array[0] && rangeString[0] === '(') {
    array[0] += 1;
  }
  if (array[1] && rangeString[rangeString.length - 1] === ')') {
    array[1] -= 1;
  }
  return { from: array[0] || null, to: array[1] || null };
}

async function getImages(boardgameID) {
  const query = SQL`SELECT id, uri, type FROM image WHERE boardgame_id=${boardgameID}`;
  const allImages = (await pool.query(query)).rows;
  return {
    photos: allImages.filter(img => img.type === 'photo'),
    cover: allImages.filter(img => img.type === 'cover')[0],
    box: allImages.filter(img => img.type === 'box')[0],
    table: allImages.filter(img => img.type === 'table')[0],
  };
}

async function getInstructions(boardgameID) {
  const query = SQL`
    SELECT i.id, i.text_uri, v.id video_id, v.uri video_uri FROM instruction i
    LEFT OUTER JOIN video v ON (i.video_id = v.id)
    WHERE i.boardgame_id=${boardgameID}`;
  const result = await pool.query(query);
  const instructions = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    const instruction = Object.assign({}, result.rows[i]);
    if (instruction.video_id) {
      instruction.video = { id: instruction.video_id, uri: instruction.video_uri };
    }
    instructions.push(instruction);
  }
  return instructions;
}

async function getVideo(videoID) {
  const query = SQL`SELECT id, uri FROM video WHERE id=${videoID}`;
  return (await pool.query(query)).rows[0];
}

function boardgamesResolver(publisherID, designerID) {
  // TODO: ensure board games are sorted e.g. by ID
  return async (args: {search?: string, ids?: string}) => {
    const fragments = [];
    const query = SQL`
      SELECT
        id, name, slug, subtitle, description, review_video_id, age_restriction,
        players_number, playing_time, publisher_id, designer_id, difficulty, randomness,
        popularity, bgg_rating, bgg_id, year_published
      FROM boardgame`;
    if (publisherID) {
      fragments.push(SQL`publisher_id=${publisherID}`);
    }
    if (designerID) {
      fragments.push(SQL`designer_id=${designerID}`);
    }
    if (args.search) {
      const search = `%${args.search}%`;
      fragments.push(SQL`name ILIKE ${search}`);
    }
    if (args.ids) {
      fragments.push(SQL`id = ANY(${args.ids}::int[])`);
    }

    if (fragments.length > 0) {
      query.append(SQL` WHERE `);
      fragments.forEach((val, idx) => {
        if (idx > 0) {
          query.append(SQL` AND `);
        }
        query.append(val);
      });
    }
    const result = await pool.query(query);
    const boardgames = [];
    await Promise.all(result.rows.map(async (row) => {
      const boardgame = Object.assign({}, row);
      const images = await getImages(boardgame.id);
      boardgame.photos = images.photos;
      boardgame.cover_image = images.cover;
      boardgame.box_image = images.box;
      boardgame.table_image = images.table;
      boardgame.age_restriction = parseIntRange(boardgame.age_restriction);
      boardgame.players_number = parseIntRange(boardgame.players_number);
      boardgame.playing_time = parseIntRange(boardgame.playing_time);
      boardgame.bgg_rating = boardgame.bgg_rating || '';
      boardgame.bgg_id = boardgame.bgg_id || '';
      boardgame.instructions = async () => getInstructions(boardgame.id);
      if (boardgame.review_video_id) {
        boardgame.review_video = async () => getVideo(boardgame.review_video_id);
      }
      if (boardgame.publisher_id) {
        // TODO: Below is causing N+1 queries.
        // Optimize by passing all board game ids.
        // Make the first resolve evalute it lazily.
        boardgame.publisher = async () => (await publishersResolver(boardgame.publisher_id)())[0];
      }
      if (boardgame.designer_id) {
        // TODO: ditto
        boardgame.designer = async () => (await designersResolver(boardgame.designer_id)())[0];
      }
      boardgames.push(boardgame);
    }));
    return boardgames;
  };
}

function designersResolver(designerID) {
  // TODO: ensure designers are sorted e.g. by ID
  const query = SQL`SELECT id, name, website_uri FROM designer`;
  if (designerID) {
    query.append(SQL` WHERE id=${designerID}`);
  }
  return async () => {
    const result = await pool.query(query);
    const designers = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const designer = Object.assign({}, result.rows[i]);
      // TODO: Below is causing N+1 queries.
      // Optimize by passing all designer ids.
      // Make the first resolve evalute it lazily.
      designer.boardgames = boardgamesResolver(null, designer.id);
      designers.push(designer);
    }
    return designers;
  };
}

function publishersResolver(publisherID) {
  // TODO: ensure publishers are sorted e.g. by ID
  const query = SQL`SELECT id, name, website_uri FROM publisher`;
  if (publisherID) {
    query.append(SQL` WHERE id=${publisherID}`);
  }
  return async () => {
    const result = await pool.query(query);
    const publishers = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      const publisher = Object.assign({}, result.rows[i]);
      // TODO: See designersResolver
      publisher.boardgames = boardgamesResolver(publisher.id, null);
      publishers.push(publisher);
    }
    return publishers;
  };
}

const root = {
  boardgames: boardgamesResolver(null, null),
  publishers: publishersResolver(null),
  designers: designersResolver(null),
};

export default root;
