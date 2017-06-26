# Backend code - api.gameonboard.net

- GraphQL schema
- Node.js server (configured with https://neutrino.js.org/)
- database

# Setup:

`docker build -t boardgames-backend .`

# Running server

`docker run -p 4000:4000 boardgames-backend`

Server is running on http://localhost:4000/graphql

# Example GraphQL query over HTTP

GraphQL query (to test in the editor):
```
{
  boardgames {
    id
    name
    photos {
      id
    }
    age_restriction {
      from
      to
    }
    players_number {
      from
      to
    }
  }
  publishers {
    id
    boardgames {
      name
    }
  }
}
```

Using [httpie](https://httpie.org/):
```
http http://localhost:4000/graphql\?query\=\{boardgames\{id%20name%20photos%20\{id\}%20age_restriction\{from%20to\}%20players_number\{from%20to\}\}%20publishers\{id%20boardgames\{name\}\}\}
```

Response:
```
HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 304
Content-Type: application/json; charset=utf-8
Date: Sun, 21 May 2017 21:49:59 GMT
ETag: W/"130-rh/2MjFhYJ8JbC16nBT/HQ"
X-Powered-By: Express

{
    "data": {
        "boardgames": [
            {
                "age_restriction": {
                    "from": 5,
                    "to": null
                },
                "id": "1",
                "name": "Chess",
                "photos": [],
                "players_number": {
                    "from": 2,
                    "to": 2
                }
            },
            {
                "age_restriction": {
                    "from": 5,
                    "to": null
                },
                "id": "2",
                "name": "Go",
                "photos": [],
                "players_number": {
                    "from": 2,
                    "to": 2
                }
            }
        ],
        "publishers": [
            {
                "boardgames": [
                    {
                        "name": "Chess"
                    }
                ],
                "id": "1"
            }
        ]
    }
}
```