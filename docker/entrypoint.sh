#!/bin/sh

# if EOSIO_PUB_KEY isn't set , let's use the default value
if [ -z "${EOSIO_PUB_KEY}" ]; then
  export EOSIO_PUB_KEY=EOS6aP916AQaTsxFmQiLyoex2jMuyewJHtK7PhF5o6LyTXeuaTFnb
fi

# Update EOSIO_PUB_KEY to genesis file
sed -i "s/EOS6aP916AQaTsxFmQiLyoex2jMuyewJHtK7PhF5o6LyTXeuaTFnb/$EOSIO_PUB_KEY/g" ./node/genesis.json

# if EOSIO_PRV_KEY isn't set , let's use the default value
if [ -z "${EOSIO_PRV_KEY}" ]; then
  export EOSIO_PRV_KEY=5JLPcFr2KWnHMaXRnEc1JyRcRj8KegqsnXwRw24VYdLGhjwEQuN
fi

# if SYSTEM_TOKEN_AMOUNT isn't set , let's use the default value
if [ -z "${SYSTEM_TOKEN_AMOUNT}" ]; then
  export SYSTEM_TOKEN_AMOUNT="10000000.0000"
fi

# if SYSTEM_TOKEN_SYMBOL isn't set , let's use the default value
if [ -z "${SYSTEM_TOKEN_SYMBOL}" ]; then
  export SYSTEM_TOKEN_SYMBOL="SYS"
fi

export SYSTEM_TOKEN_SUPPLY="${SYSTEM_TOKEN_AMOUNT} ${SYSTEM_TOKEN_SYMBOL}"

# if ENABLE_SYSTEM_CONTRACT isn't set , let's use the default value
if [ -z "${ENABLE_SYSTEM_CONTRACT}" ]; then
  export ENABLE_SYSTEM_CONTRACT=0
fi

cd node/ && ./start.sh

cd /app/
./scripts/wait-for-nodeos.sh
./scripts/create_wallet.sh
./scripts/deploy_token_contract.sh

if [ $ENABLE_SYSTEM_CONTRACT -eq 1 ]; then
  if [ "$SYSTEM_TOKEN_SYMBOL" = "EOS" ]; then
    echo "Deploy EOS System Contracts..."
    ./scripts/deploy_system_contract_eos.sh
  elif [ "$SYSTEM_TOKEN_SYMBOL" = "WAX" ]; then
    echo "Deploy WAX System Contracts..."
    ./scripts/deploy_system_contract_wax.sh
  elif [ "$SYSTEM_TOKEN_SYMBOL" = "TLOS" ]; then
    echo "Deploy TELOS System Contracts..."
    ./scripts/deploy_system_contract_tlos.sh
  else
    echo "No available system contracts for token symbol: " + $SYSTEM_TOKEN_SYMBOL
  fi
fi

tail -f /dev/null
exec "$@"
