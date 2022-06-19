#!/bin/sh
DATADIR="./logs"

BPACCOUNT=eosio
PUBKEY=EOS6aP916AQaTsxFmQiLyoex2jMuyewJHtK7PhF5o6LyTXeuaTFnb
PRIKEY=5JLPcFr2KWnHMaXRnEc1JyRcRj8KegqsnXwRw24VYdLGhjwEQuN

if [ ! -d $DATADIR ]; then
  mkdir -p $DATADIR;
fi

nodeos \
--signature-provider $PUBKEY=KEY:$PRIKEY \
--plugin eosio::net_plugin \
--plugin eosio::net_api_plugin \
--plugin eosio::producer_plugin \
--plugin eosio::producer_api_plugin \
--plugin eosio::chain_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--plugin eosio::history_api_plugin \
--plugin eosio::history_plugin \
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
--max-transaction-time=1000 \
--chain-state-db-size-mb 8192 \
--chain-state-db-guard-size-mb 1024 \
--hard-replay-blockchain \
>> $DATADIR"/nodeos.log" 2>&1 & \
echo $! > $DATADIR"/eosd.pid"