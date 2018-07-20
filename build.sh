#!/bin/sh

rm build/*
riot --ext tag . build

cat libs/*.js > release/linkchecker-latest.js
cat *.js >> release/linkchecker-latest.js
cat build/*.js >> release/linkchecker-latest.js

closure-compiler libs/*.js > release/linkchecker-latest.min.js
closure-compiler *.js >> release/linkchecker-latest.min.js
closure-compiler build/*.js >> release/linkchecker-latest.min.js

# TODO try:
# closure-compiler -O ADVANCED libs/*.js build/*.js > release/linkchecker-latest.min.js
