#!/bin/bash

cd WebEZ-core
npm run build
npm run pub
cd ../WebEZ-CLI
npm run build
npm run pub
cd ../WebEZ-Example
npm i -D @gsilber/webez
npm run build
cd ../movies
npm i -D @gsilber/webez
npm run build
cd ../lander
npm i -D @gsilber/webez
npm run build
cd ../web-pong
npm i -D @gsilber/webez
npm run build
cd ..
./builddocs.sh