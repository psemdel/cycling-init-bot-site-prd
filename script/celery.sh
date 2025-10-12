#!/bin/bash
cd /data/project/cycling-init-bot/www/python/src
source $HOME/www/python/src/venv/bin/activate #otherwise does not find celery

#/data/project/cycling-init-bot/venv_celery/bin/celery -A CyclingInitBotSite worker -l info -P solo
/data/project/cycling-init-bot/www/python/src/venv/bin/celery -A CyclingInitBotSite worker -l info -P solo
