#!/bin/bash
/data/project/cycling-init-bot/venv_celery/bin/celery -A CyclingInitBotSite worker -l info
