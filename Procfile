web: gunicorn CyclingInitBotSite.wsgi --log-file -
release: python manage.py migrate
worker: celery -A CyclingInitBotSite worker --without-gossip --without-mingle --without-heartbeat --loglevel=info

