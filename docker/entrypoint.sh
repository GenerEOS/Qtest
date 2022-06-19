#!/bin/sh
if [ -z "${HOME_DIR}" ]; then
  export HOME_DIR=$PWD
fi

if [ -z "${EOSIO_PUB_KEY}" ]; then
  export EOSIO_PUB_KEY=EOS6aP916AQaTsxFmQiLyoex2jMuyewJHtK7PhF5o6LyTXeuaTFnb
fi

if [ -z "${EOSIO_PRV_KEY}" ]; then
  export EOSIO_PRV_KEY=5JLPcFr2KWnHMaXRnEc1JyRcRj8KegqsnXwRw24VYdLGhjwEQuN
fi

if [ -z "${SYSTEM_TOKEN_SUPPLY}" ]; then
  export SYSTEM_TOKEN_SUPPLY="10000000.0000 SYS"
fi

cd node/ && ./start.sh

cd ${HOME_DIR}
./scripts/wait-for-nodeos.sh
./scripts/create_wallet.sh
./scripts/deploy_token_contract.sh

tail -f /dev/null
exec "$@"
