toolforge jobs run --continuous --image python3.11 --command "/data/project/cycling-init-bot/www/python/venv/bin/celery -A /data/project/cycling-init-bot/www/python/src/CyclingInitBotSite worker -l info -P solo" celery-worker

