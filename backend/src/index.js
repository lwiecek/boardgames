import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type OpenRange {
    from: Int
    to: Int
  }
  type Publisher {
    id: ID!
    name: String!
    website_uri: String
    boardgames: [BoardGame!]!
  }
  type Designer {
    id: ID!
    name: String!
    website_uri: String
    boardgames: [BoardGame!]!
  }
  type Image {
    id: ID!
    uri: String!
  }
  type Video {
    id: ID!
    uri: String!
  }
  type Instructions {
    id: ID!
    text_uri: String
    video: Video
    boardgame: BoardGame!
  }
  type BoardGame {
    id: ID!
    name: String!
    slug: String!
    subtitle: String!
    description: String!
    table_image: Image
    cover_image: Image
    box_image: Image
    photos: [Image!]!
    instructions: Instructions
    review_video: Video
    age_restriction: OpenRange!
    players_number: OpenRange!
    publisher: Publisher
    designer: Designer
    difficulty: Int
    randomness: Int
    popularity: Int
    bgg_rating: String!
  }
  type Query {
    boardgames(search: String): [BoardGame!]!
    publishers: [Publisher!]!
    designers: [Designer!]!
  }
`);

const fakeChessPublisher = {
  id: 1,
  name: 'Chess publisher',
};

const fakeChess = {
  id: 1,
  name: 'Chess',
  slug: 'chess',
  subtitle: 'Best game ever',
  description: 'Long time ago Lorem ipsum',
  age_restriction: { from: 5, to: null },
  players_number: { from: 2, to: 2 },
  publisher: fakeChessPublisher,
  photos: [],
};

fakeChessPublisher.boardgames = [fakeChess];

const fakeGo = {
  id: 2,
  name: 'Go',
  slug: 'go',
  subtitle: 'Second Best game ever',
  description: 'Long time ago Lorem ipsum',
  age_restriction: { from: 5, to: null },
  players_number: { from: 2, to: 2 },
  photos: [],
};

const fakeBoardGames = [
  fakeChess,
  fakeGo,
];

const root = {
  boardgames: args =>
    fakeBoardGames.filter(elm => !args.search || elm.name.indexOf(args.search) !== -1),
  publishers: () => [fakeChessPublisher],
};

const app = express();
app.use((req, res, next) => {
  // To access GraphQL server running different port on localhost.
  let oneof = false;
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
    oneof = true;
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    oneof = true;
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // intercept OPTIONS method
  if (oneof && req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
