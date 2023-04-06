#!/bin/bash

cd /app/

systemAccounts=("eosio.token" "eosio.bpay" "eosio.msig" "eosio.names" "eosio.ram" "eosio.ramfee" "eosio.saving" "eosio.stake" "eosio.vpay" "eosio.rex")
# Create system accounts
for account in ${systemAccounts[@]} ; do
  echo $account
	cleos create account eosio $account ${EOSIO_PUB_KEY};
done

# Deploy token contract
cleos set contract eosio.token contracts/eosio.token eosio.token.wasm eosio.token.abi
cleos push action eosio.token create '["eosio", "46116860184.27387903 WAX"]' -p eosio.token@active
cleos push action eosio.token issue '[ "eosio", "46116860184.27387903 WAX", "initial supply" ]' -p eosio@active

# Deploy msig contract
cleos set contract eosio.msig contracts/eosio.msig eosio.msig.wasm eosio.msig.abi

# Activate PREACTIVATE_FEATURE
curl -X POST http://127.0.0.1:8888/v1/producer/schedule_protocol_feature_activations -d '{"protocol_features_to_activate": ["0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd"]}'
sleep 2

# install eosio.boot which supports the native actions and activate 
# action that allows activating desired protocol features prior to 
# deploying a system contract with more features such as eosio.bios 
# or eosio.system
cleos set contract eosio contracts/wax eosio.system_1.7.x.wasm eosio.system_1.7.x.abi

sleep 1

# BLOCKCHAIN_PARAMETERS
cleos push action eosio activate '["5443fcf88330c586bc0e5f3dee10e7f63c76c00249c87fe4fbf7f38c082006b4"]' -p eosio@active
# CONFIGURABLE_WASM_LIMITS2
cleos push action eosio activate '["d528b9f6e9693f45ed277af93474fd473ce7d831dae2180cca35d907bd10cb40"]' -p eosio@active
# WTMSIG_BLOCK_SIGNATURES
cleos push action eosio activate '["299dcb6af692324b899b39f16d5a530a33062804e41f09dc97e9f156b4476707"]' -p eosio@active
# ACTION_RETURN_VALUE
cleos push action eosio activate '["c3a6138c5061cf291310887c0b5c71fcaffeab90d5deb50d3b9e687cead45071"]' -p eosio@active
# GET_SENDER
cleos push action eosio activate '["f0af56d2c5a48d60a4a5b5c903edfb7db3a736a94ed589d0b797df33ff9d3e1d"]' -p eosio@active
# FORWARD_SETCODE
cleos push action eosio activate '["2652f5f96006294109b3dd0bbde63693f55324af452b799ee137a81a905eed25"]' -p eosio@active
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
# NO_DUPLICATE_DEFERRED_ID 
cleos push action eosio activate '["4a90c00d55454dc5b059055ca213579c6ea856967712a56017487886a4d4cc0f"]' -p eosio@active
# ONLY_LINK_TO_EXISTING_PERMISSION
cleos push action eosio activate '["1a99a59d87e06e09ec5b028a9cbb7749b4a5ad8819004365d02dc4379a8b7241"]' -p eosio@active
# RAM_RESTRICTIONS
cleos push action eosio activate '["4e7bf348da00a945489b2a681749eb56f5de00b900014e137ddae39f48f69d67"]' -p eosio@active
# GET_BLOCK_NUM
cleos push action eosio activate '["35c2186cc36f7bb4aeaf4487b36e57039ccf45a9136aa856a5d569ecca55ef2b"]' -p eosio@active
# WEBAUTHN_KEY
cleos push action eosio activate '["4fca8bd82bbd181e714e283f83e1b45d95ca5af40fb89ad3977b653c448f78c2"]' -p eosio@active
# GET_CODE_HASH
cleos push action eosio activate '["bcd2a26394b36614fd4894241d3c451ab0f6fd110958c3423073621a70826e99"]' -p eosio@active
# CRYPTO_PRIMITIVES
cleos push action eosio activate '["6bcb40a24e49c26d0a60513b6aeb8551d264e4717f306b81a37a5afb3b47cedc"]' -p eosio@active

# Try deploy system contracts
until cleos set contract eosio contracts/wax eosio.system.wasm eosio.system.abi
do
  sleep 1s
done

sleep 1

# Designate eosio.msig as privileged account
cleos push action eosio setpriv '["eosio.msig", 1]' -p eosio@active

# Init system contract
cleos push action eosio init '[0, "8,WAX"]' -p eosio@active