#!/bin/bash

curl -f --request POST \
  --url https://stg2-chain.thh.io/v1/chain/get_block_info \
  --data '{"block_num":"1"}'

if [[ $? -eq 0 ]]
then
    exit 0
else
    exit 1
fi