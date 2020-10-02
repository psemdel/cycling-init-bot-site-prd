#!/bin/bash
echo "starting sequence"
./start_venv.sh > /dev/null 2>&1 &
./celery.sh > /dev/null 2>&1 &
echo "starting sequence finished"

