toolforge jobs run --continuous --image python3.11 --command "/data/project/cycling-init-bot/www/python/src/venv/bin/celery -A CyclingInitBotSite worker -l info -P solo" celery-worker

