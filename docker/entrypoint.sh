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

# Update new key
sed -i "s/EOS6aP916AQaTsxFmQiLyoex2jMuyewJHtK7PhF5o6LyTXeuaTFnb/$EOSIO_PUB_KEY/g" ./node/genesis.json

if [ -z "${SYSTEM_TOKEN_AMOUNT}" ]; then
  export SYSTEM_TOKEN_AMOUNT="10000000.0000"
fi

if [ -z "${SYSTEM_TOKEN_SYMBOL}" ]; then
  export SYSTEM_TOKEN_SYMBOL="SYS"
fi

export SYSTEM_TOKEN_SUPPLY="${SYSTEM_TOKEN_AMOUNT} ${SYSTEM_TOKEN_SYMBOL}"

if [ -z "${ENABLE_SYSTEM_CONTRACT}" ]; then
  export ENABLE_SYSTEM_CONTRACT=0
fi

cd node/ && ./start.sh

cd ${HOME_DIR}
./scripts/wait-for-nodeos.sh
./scripts/create_wallet.sh
./scripts/deploy_token_contract.sh

if [ $ENABLE_SYSTEM_CONTRACT -eq 1 ]; then
  if [ "$SYSTEM_TOKEN_SYMBOL" = "EOS" ]; then
    echo "Deploy EOS System Contracts..."
    ./scripts/deploy_eos_system_contract.sh
  elif [ "$SYSTEM_TOKEN_SYMBOL" = "WAX" ]; then
    echo "Deploy WAX System Contracts..."
    ./scripts/deploy_wax_system_contract.sh
  elif [ "$SYSTEM_TOKEN_SYMBOL" = "TELOS" ]; then
    echo "Deploy TELOS System Contracts..."
  else
    echo "No available for system contracts: " + $SYSTEM_TOKEN_SYMBOL
  fi
fi

tail -f /dev/null
exec "$@"
