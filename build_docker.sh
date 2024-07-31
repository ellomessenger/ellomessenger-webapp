#!/usr/bin/env bash
yarn
yarn run build:production
docker rmi -f ello-web-app-prod  
docker build . -f docker/Dockerfile --tag ello-web-app-prod --no-cache
