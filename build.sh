#!/bin/sh

rm build/*
riot --ext tag . build

cat libs/*.js > release/linkchecker-latest.js
cat build/*.js >> release/linkchecker-latest.js

closure-compiler libs/*.js > release/linkchecker-latest.min.js
closure-compiler build/*.js >> release/linkchecker-latest.min.js
