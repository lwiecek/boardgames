# api.gameonboard.net

Backend code. Work in progress, domain not configured yet.

## Stack
- GraphQL
- Node.js
- PostgreSQL

## Setup

`docker-compose up`

## Update the code

`docker-compose build`

## Running server

`docker-compose up`

Server is running on http://localhost:4000/graphql

## Production

`docker-compose run backend yarn prod:build`
`docker-compose build`
`docker-compose run --service-ports backend yarn prod:start`

## Running tests
`docker-compose run backend yarn test`

## Database migrations
`docker-compose run backend yarn db/migrate`

## Load initial data from BoardGameGeek
`docker-compose run backend yarn external_api/boardgamegeek load_boardgames`

## psql access
`docker-compose run -e PGPASSWORD=changeme db psql -h db -U boardgames boardgames`

## Example GraphQL query

Test in the GraphiQL editor (http://localhost:4000/graphql):
```
{
  boardgames(search: "t") {id, name, subtitle, slug}
  publishers { name, boardgames {id, name} }
}
```

Result:
```
{
  "data": {
    "boardgames": [
      {
        "id": "1",
        "name": "Tak",
        "subtitle": "A Beautiful Game",
        "slug": "tak"
      }
    ],
    "publishers": [
      {
        "name": "Cheapass Games",
        "boardgames": [
          {
            "id": "1",
            "name": "Tak"
          }
        ]
      }
    ]
  }
}
```
