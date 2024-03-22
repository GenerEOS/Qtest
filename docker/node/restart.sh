#!/bin/sh
DATADIR="./logs/"$SYSTEM_TOKEN_SYMBOL

BPACCOUNT=eosio

if [ ! -d $DATADIR ]; then
  mkdir -p $DATADIR;
fi

ARCH=`uname -m`

NODEOS='/usr/local/bin/nodeos'

if [ "${ARCH}" = "x86_64" ]; then
   EOSVM=eos-vm-jit
   if [ "$SYSTEM_TOKEN_SYMBOL" = "WAX" ]; then
      NODEOS='/usr/local/bin/wax/nodeos'
   fi
else
   EOSVM=eos-vm
fi

$NODEOS \
--signature-provider $EOSIO_PUB_KEY=KEY:$EOSIO_PRV_KEY \
--plugin eosio::net_plugin \
--plugin eosio::net_api_plugin \
--plugin eosio::producer_plugin \
--plugin eosio::producer_api_plugin \
--plugin eosio::chain_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--data-dir $DATADIR"/data" \
--blocks-dir $DATADIR"/blocks" \
--config-dir $DATADIR"/config" \
--producer-name $BPACCOUNT \
--http-server-address 0.0.0.0:8888 \
--p2p-listen-endpoint 0.0.0.0:9010 \
--access-control-allow-origin=* \
--contracts-console \
--http-validate-host=false \
--verbose-http-errors \
--enable-stale-production \
--trace-history \
--chain-state-history \
--max-transaction-time=2000 \
--abi-serializer-max-time-ms=60000 \
--http-max-response-time-ms=8000 \
--chain-state-db-size-mb 8192 \
--chain-state-db-guard-size-mb 1024 \
--wasm-runtime=$EOSVM \
>> $DATADIR"/nodeos.log" 2>&1 & \
echo $! > $DATADIR"/eosd.pid"