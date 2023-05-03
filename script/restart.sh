#!/usr/bin/env bash

webservice --backend=kubernetes python3.9 restart

if [[ -x  $HOME/www/python/src/script/celery.sh ]]
then
    echo "celery.sh ok"
else
    echo "celery.sh is not executable"
fi

echo "permission should be 600"
echo ls -l $HOME/www/python/src/user-config.py
echo ls -l $HOME/www/python/src/user-password.py

kubectl delete deployment cycling-init-bot.worker
kubectl create --validate=true -f $HOME/www/python/src/script/deployment.yml
