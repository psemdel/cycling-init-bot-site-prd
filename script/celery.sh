#!/bin/bash
/data/project/cycling-init-bot/www/python/venv/bin/celery -A CyclingInitBotSite worker -l info
