#!/usr/bin/env bash

cd ..
git pull https://phabricator.wikimedia.org/source/tool-cycling-init-bot.git
git submodule foreach git pull origin master
