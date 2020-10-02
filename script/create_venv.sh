#!/bin/bash
VENV_DIR=$HOME/www/python/src/venv

echo "Creating venv"
rm -rf ${VENV_DIR}
python3 -m venv ${VENV_DIR}
source ${VENV_DIR}/bin/activate
pip install -r $HOME/www/python/src/requirements.txt
