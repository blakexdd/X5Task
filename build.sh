#!/bin/bash
cp .env.example .env
docker login $CI_REPOSITORY_NAME $CI_REPOSITORY_PASSWORD 
docker build -t $APP_IMAGE -f stack/dockerfiles/Dockerfile.x5app .
docker push $APP_IMAGE
docker build -t $PYTHON_APP_IMAGE -f stack/dockerfiles/Dockerfile.x5python-app .
docker push $PYTHON_APP_IMAGE