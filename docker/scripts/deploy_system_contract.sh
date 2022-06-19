#!/bin/bash

cd ${HOME_DIR}/

# Create accounts
cleos create account eosio eosio.bpay ${EOSIO_PUB_KEY}
cleos create account eosio eosio.msig ${EOSIO_PUB_KEY}
cleos create account eosio eosio.names ${EOSIO_PUB_KEY}
cleos create account eosio eosio.ram ${EOSIO_PUB_KEY}
cleos create account eosio eosio.ramfee ${EOSIO_PUB_KEY}
cleos create account eosio eosio.saving ${EOSIO_PUB_KEY}
cleos create account eosio eosio.stake ${EOSIO_PUB_KEY}
cleos create account eosio eosio.token ${EOSIO_PUB_KEY}
cleos create account eosio eosio.vpay ${EOSIO_PUB_KEY}
cleos create account eosio eosio.rex ${EOSIO_PUB_KEY}

# Deploy token contract
cleos set contract eosio.token contracts eosio.token.wasm eosio.token.abi

# Create and issue the WAX currency
cleos push action eosio.token create '[ "eosio", "20000000000.00000000 WAX" ]' -p eosio.token@active
cleos push action eosio.token issue '[ "eosio", "10000000000.00000000 WAX", "initial" ]' -p eosio@active

# Deploy token contract msig contract
cleos set contract eosio.msig contracts eosio.msig.wasm eosio.msig.abi

curl -X POST http://127.0.0.1:8888/v1/producer/get_supported_protocol_features -d '{}' | jq
curl -X POST http://127.0.0.1:8888/v1/producer/schedule_protocol_feature_activations -d '{"protocol_features_to_activate": ["0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd"]}' | jq

# Try deploy system contracts
until cleos set contract eosio contracts eosio.system.wasm eosio.system.abi
do
  sleep 1s
done

# GET_SENDER
cleos push action eosio activate '["f0af56d2c5a48d60a4a5b5c903edfb7db3a736a94ed589d0b797df33ff9d3e1d"]' -p eosio
# FORWARD_SETCODE
cleos push action eosio activate '["2652f5f96006294109b3dd0bbde63693f55324af452b799ee137a81a905eed25"]' -p eosio
# ONLY_BILL_FIRST_AUTHORIZER
cleos push action eosio activate '["8ba52fe7a3956c5cd3a656a3174b931d3bb2abb45578befc59f283ecd816a405"]' -p eosio@active
# RESTRICT_ACTION_TO_SELF
cleos push action eosio activate '["ad9e3d8f650687709fd68f4b90b41f7d825a365b02c23a636cef88ac2ac00c43"]' -p eosio@active
# DISALLOW_EMPTY_PRODUCER_SCHEDULE
cleos push action eosio activate '["68dcaa34c0517d19666e6b33add67351d8c5f69e999ca1e37931bc410a297428"]' -p eosio@active
# FIX_LINKAUTH_RESTRICTION
cleos push action eosio activate '["e0fb64b1085cc5538970158d05a009c24e276fb94e1a0bf6a528b48fbc4ff526"]' -p eosio@active
# REPLACE_DEFERRED
cleos push action eosio activate '["ef43112c6543b88db2283a2e077278c315ae2c84719a8b25f25cc88565fbea99"]' -p eosio@active
# NO_DUPLIWAXE_DEFERRED_ID
cleos push action eosio activate '["4a90c00d55454dc5b059055ca213579c6ea856967712a56017487886a4d4cc0f"]' -p eosio@active
# ONLY_LINK_TO_EXISTING_PERMISSION
cleos push action eosio activate '["1a99a59d87e06e09ec5b028a9cbb7749b4a5ad8819004365d02dc4379a8b7241"]' -p eosio@active
# RAM_RESTRICTIONS
cleos push action eosio activate '["4e7bf348da00a945489b2a681749eb56f5de00b900014e137ddae39f48f69d67"]' -p eosio@active
sleep 3

# Designate eosio.msig as privileged account
cleos push action eosio setpriv '["eosio.msig", 1]' -p eosio@active

# init system contract
cleos push action eosio init '[0, "8,WAX"]' -p eosio@active


