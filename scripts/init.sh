#!/bin/sh

mkdir ./backend/node_modules
# touch ./backend/node_modules/test.md
mkdir ./frontend/node_modules
# touch ./frontend/node_modules/test.md

# echo "here"

# docker volume create node_modules_data
# docker run --rm -v node_modules_data:/data busybox chown -R 1000:100 /data

docker compose -f docker-compose.dev.yml up -d
