#!/usr/bin/env bash

webservice --backend=kubernetes python3.7 restart
kubectl delete deployment cycling-init-bot.worker
kubectl create --validate=true -f $HOME/www/python/src/script/deployment.yml
