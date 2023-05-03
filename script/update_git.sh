#!/usr/bin/env bash

cd ..
git pull https://github.com/psemdel/cycling-init-bot-site-prd.git
git submodule foreach git pull origin master
