#!/usr/bin/env bash
yarn && yarn run build:staging
docker rmi -f ello-web-app  
docker build . -f docker/Dockerfile --tag ello-web-app --no-cache