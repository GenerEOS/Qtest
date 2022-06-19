#!/bin/bash

cd ${HOME_DIR}/

cleos create account eosio eosio.token ${EOSIO_PUB_KEY}

# Deploy token contract
cleos set contract eosio.token contracts eosio.token.wasm eosio.token.abi

# Create and issue the WAX currency
CREATE_CMD='cleos push action eosio.token create '"'"'["eosio", "'$SYSTEM_TOKEN_SUPPLY'"]'"'"' -p eosio.token@active'
eval $CREATE_CMD
ISSUE_CMD='cleos push action eosio.token issue '"'"'[ "eosio", "'$SYSTEM_TOKEN_SUPPLY'", "initial supply" ]'"'"' -p eosio@active'
eval $ISSUE_CMD