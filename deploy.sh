#!/bin/bash
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CLOSE='\033[0m'
CYAN='\033[0;36m'

log(){
    echo -e "${CYAN}[$(date "+%Y-%m-%d %H:%M:%S")] $1"
}

if [[ $(docker network ls | grep "app") = "" ]]; then
    log "${GREEN} Creating app network ${CLOSE}"
    docker network create --opt encrypted -d overlay --attachable app
else
    log "${YELLOW} Network app already exists ${CLOSE}"
fi

log "${GREEN} Building images ${CLOSE}"
docker build -t x5app -f stack/dockerfiles/Dockerfile.x5app .
docker build -t x5python-app -f stack/dockerfiles/Dockerfile.x5python-app .

log "${GREEN} Deploying app ${CLOSE}"
docker stack deploy --resolve-image never -c stack/db/stack.yml app-db-stack
docker stack deploy --resolve-image never -c stack/elk/stack.yml elk-stack
docker run --name migrations --network app --env-file stack/app/app.env --rm x5app\
    sh -c 'node ace db:wait && node ace migration:run --connection mysql --force && node ace db:seed'
docker stack deploy --resolve-image never -c stack/app/stack.yml app-stack
