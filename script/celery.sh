#!/bin/bash
echo "Starting celery"
/data/project/cycling-init-bot/www/python/venv/bin/python3 /data/project/cycling-init-bot/www/python/venv/bin/celery -A /data/project/cycling-init-bot/www/python/CyclingInitBotSite worker -l info
echo "Celery started"
