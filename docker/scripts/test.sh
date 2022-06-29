 #!/bin/sh
#  export SYSTEM_TOKEN_SUPPLY="123456.0000 SYS"
#  export SYSTEM_TOKEN_SUPPLY_STR=\"$SYSTEM_TOKEN_SUPPLY\"
#  echo \'[ "eosio", \"$SYSTEM_TOKEN_SUPPLY\"]\'
#  cleos push action eosio.token create "'[ "eosio", '$SYSTEM_TOKEN_SUPPLY_STR']'" -p eosio.token@active

export SYSTEM_TOKEN_SUPPLY="123456.0000 SYS"
DEPLOY_CMD='cleos push action eosio.token create '"'"'["eosio", "'$SYSTEM_TOKEN_SUPPLY'"]'"'"' -p eosio.token@active'
ISSUE_CMD='cleos push action eosio.token issue '"'"'[ "eosio", "'$SYSTEM_TOKEN_SUPPLY'", "initial supply" ]'"'"' -p eosio@active'
echo $DEPLOY_CMD
echo $ISSUE_CMD
eval $DEPLOY_CMD