#!/bin/bash

if [[ $(docker network ls | grep "app") = "" ]]; then
    docker network create --opt encrypted -d overlay --attachable app
fi

docker build -t x5app -f stack/dockerfiles/Dockerfile.x5app .
docker build -t x5python-app -f stack/dockerfiles/Dockerfile.x5python-app .

docker stack deploy --resolve-image never -c stack/db/stack.yml app-db-stack
docker stack deploy --resolve-image never -c stack/elk/stack.yml elk-stack
docker run --name migrations --network app --env-file stack/app/app.env --rm x5app\
    sh -c 'node ace db:wait && node ace migration:run --connection mysql --force && node ace db:seed'
docker stack deploy --resolve-image never -c stack/app/stack.yml app-stack
