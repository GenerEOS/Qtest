#!/bin/bash

curl -f --request POST \
  --url http://127.0.0.1:8888/v1/chain/get_block \
  --data '{"block_num_or_id":"18"}'

if [[ $? -eq 0 ]]
then
    exit 0
else
    exit 1
fi