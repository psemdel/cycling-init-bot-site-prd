#!/usr/bin/env bash

webservice --backend=kubernetes python3.7 restart

if [[ -x  $HOME/www/python/src/script/celery.sh ]]
then
    echo "celery.sh ok"
else
    echo "celery.sh is not executable"
fi

kubectl delete deployment cycling-init-bot.worker
kubectl create --validate=true -f $HOME/www/python/src/script/deployment.yml
