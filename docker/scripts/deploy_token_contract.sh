#!/bin/bash

cd /app/

cleos create account eosio eosio.token ${EOSIO_PUB_KEY}

# Deploy token contract
until cleos set contract eosio.token contracts/eosio.token eosio.token.wasm eosio.token.abi
do
  sleep 1s
done

# Create and issue the WAX currency
CREATE_CMD='cleos push action eosio.token create '"'"'["eosio", "'$SYSTEM_TOKEN_SUPPLY'"]'"'"' -p eosio.token@active'
eval $CREATE_CMD
ISSUE_CMD='cleos push action eosio.token issue '"'"'[ "eosio", "'$SYSTEM_TOKEN_SUPPLY'", "initial supply" ]'"'"' -p eosio@active'
eval $ISSUE_CMD

if [ $ENABLE_SYSTEM_CONTRACT -eq 0 ]; then
  cleos create account eosio qtest ${EOSIO_PUB_KEY}
fi