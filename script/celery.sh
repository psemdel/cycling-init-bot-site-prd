#!/bin/bash
cd /data/project/cycling-init-bot/www/python/src
/data/project/cycling-init-bot/venv_celery/bin/celery -A CyclingInitBotSite worker -l info -P solo
