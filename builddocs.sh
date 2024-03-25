#!/bin/bash

cd WebEZ-core
npm run doc
cd ../WebEZ-Example
npm run build
cd ../web-pong
npm run build
cd ../lander
npm run build
cd ..

