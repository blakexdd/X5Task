#!/bin/bash
cp .env.example .env
docker login -u $CI_REPOSITORY_NAME -p $CI_REPOSITORY_PASSWORD 
docker build -t $APP_IMAGE -f stack/dockerfiles/Dockerfile.x5app .
docker push $APP_IMAGE
docker build -t $PYTHON_APP_IMAGE -f stack/dockerfiles/Dockerfile.x5python-app .
docker push $PYTHON_APP_IMAGE