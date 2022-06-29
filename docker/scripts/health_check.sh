#!/bin/bash

curl -f --request POST \
  --url http://localhost:8888/v1/chain/get_table_rows \
  --data '{"table":"accounts","scope":"eosio","code":"eosio.token","limit":1,"json":true}'

if [[ $? -eq 0 ]]
then
    exit 0
else
    exit 1
fi