#!/bin/bash
VENV_DIR=$HOME/www/python/venv

echo "Creating venv"
rm -rf ${VENV_DIR}
python3 -m venv ${VENV_DIR}
source ${VENV_DIR}/bin/activate

export MYSQLCLIENT_CFLAGS="-I/usr/include/mariadb/"
export MYSQLCLIENT_LDFLAGS="-L/usr/lib/x86_64-linux-gnu/ -lmariadb"

pip install -r $HOME/www/python/src/requirements.txt
