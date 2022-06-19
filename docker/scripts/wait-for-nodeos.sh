#!/bin/bash

# wait for nodeos
until curl http://127.0.0.1:8888/v1/chain/get_info
do
  sleep 1s
done
echo
echo "nodeos is RUNNING"