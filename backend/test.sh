#!/bin/bash

docker-compose build
docker-compose run backend yarn test
