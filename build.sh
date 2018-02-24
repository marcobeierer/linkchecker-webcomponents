#!/bin/sh

rm build/*
riot --ext tag . build

cat build/*.js > release/linkchecker-latest.js
closure-compiler build/*.js > release/linkchecker-latest.min.js
