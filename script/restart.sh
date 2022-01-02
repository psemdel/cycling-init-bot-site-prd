#!/usr/bin/env bash

webservice --backend=kubernetes python3.7 restart

if [[ -x  $HOME/www/python/src/script/celery.sh ]]
then
    echo "celery.sh ok"
else
    echo "celery.sh is not executable"
fi

if [[ -w  $HOME/www/python/src/user-config.py ]]
then
    echo "user-config should not be writeable"
else
    echo "user-config ok"
fi

if [[ -w  $HOME/www/python/src/user-password.py ]]
then
    echo "user-config should not be writeable"
else
    echo "user-config ok"
fi

kubectl delete deployment cycling-init-bot.worker
kubectl create --validate=true -f $HOME/www/python/src/script/deployment.yml
