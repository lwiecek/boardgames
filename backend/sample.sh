#!/bin/bash
# Temporary script to test sample board game geek data

docker-compose build
docker-compose run backend yarn db/recreate
docker-compose run backend yarn db/migrate
docker-compose run backend yarn external_api/boardgamegeek sample_boardgames
