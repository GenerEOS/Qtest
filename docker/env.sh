#!/bin/bash
if [ -z "${EOSIO_PUB_KEY}" ]; then
  export EOSIO_PUB_KEY=EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH
fi

if test -f "./snapshot-node/genesis.json"; then
    sed -i "s/EOSIO_PUB_KEY/$EOSIO_PUB_KEY/g" ./snapshot-node/genesis.json
fi

if [ -z "${EOSIO_PRV_KEY}" ]; then
  export EOSIO_PRV_KEY=5JKxAqBoQuAYSh6YMcjxcougPpt1pi9L4PyJHwEQuZgYYgkWpjS
fi