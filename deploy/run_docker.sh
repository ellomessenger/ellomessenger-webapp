#!/usr/bin/env bash
docker rm --force $(docker ps -a -q --filter="name=ello-web-app")
sleep 5
docker run -dp 3000:80 --name ello-web-app -it ello-web-app
