#!/bin/sh

cd /app/snapshot-node/ && ./start.sh
cd /app/
./scripts/wait-for-nodeos.sh
./scripts/create_wallet.sh
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
curl http://127.0.0.1:8888/v1/producer/create_snapshot | json_pp
cd /app/snapshot-node/ && ./stop.sh && ./clear.sh
