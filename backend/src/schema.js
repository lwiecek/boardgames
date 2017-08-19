import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type IntRange {
    from: Int
    to: Int
  }
  type Publisher {
    id: ID!
    name: String!
    website_uri: String!
    boardgames: [BoardGame!]!
  }
  type Designer {
    id: ID!
    name: String!
    website_uri: String!
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
  type Instruction {
    id: ID!
    text_uri: String!
    video: Video
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
    instructions: [Instruction!]!
    review_video: Video
    age_restriction: IntRange!
    players_number: IntRange!
    playing_time: IntRange!
    publisher: Publisher
    designer: Designer
    difficulty: Int
    randomness: Int
    popularity: Int
    year_published: Int
    bgg_id: String!
    bgg_rating: String!
  }
  type Query {
    boardgames(search: String, ids: [Int!]): [BoardGame!]!
    publishers: [Publisher!]!
    designers: [Designer!]!
  }
`);

export default schema;
