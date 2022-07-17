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
cleos push action eosio.token create '["eosio", "10000000000.0000 EOS"]' -p eosio.token@active
cleos push action eosio.token issue '[ "eosio", "10000000000.0000 EOS", "initial supply" ]' -p eosio@active

# Deploy msig contract
cleos set contract eosio.msig contracts/eosio.msig eosio.msig.wasm eosio.msig.abi

# Activate PREACTIVATE_FEATURE
curl -X POST http://127.0.0.1:8888/v1/producer/schedule_protocol_feature_activations -d '{"protocol_features_to_activate": ["0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd"]}'

sleep 2

# install eosio.boot which supports the native actions and activate 
# action that allows activating desired protocol features prior to 
# deploying a system contract with more features such as eosio.bios 
# or eosio.system
cleos set contract eosio contracts/eos eosio.system_1.7.x.wasm eosio.system_1.7.x.abi

# ACTION_RETURN_VALUE
cleos push action eosio activate '["c3a6138c5061cf291310887c0b5c71fcaffeab90d5deb50d3b9e687cead45071"]' -p eosio@active
# CONFIGURABLE_WASM_LIMITS2
cleos push action eosio activate '["29a255f3e311c053847e027d352c06c77dfa9648fd8fd5dc8f629e3efffc2109"]' -p eosio@active
# BLOCKCHAIN_PARAMETERS
cleos push action eosio activate '["8e466518f3e16a679ffa80d2e810e4097e89b0495ed70c112375a1f525093f33"]' -p eosio@active
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
# WEBAUTHN_KEY
cleos push action eosio activate '["4fca8bd82bbd181e714e283f83e1b45d95ca5af40fb89ad3977b653c448f78c2"]' -p eosio@active
# WTMSIG_BLOCK_SIGNATURES
cleos push action eosio activate '["299dcb6af692324b899b39f16d5a530a33062804e41f09dc97e9f156b4476707"]' -p eosio@active
sleep 3

# Deploy system contracts
until cleos set contract eosio contracts/eos eosio.system.wasm eosio.system.abi
do
  sleep 1s
done

# Designate eosio.msig as privileged account
cleos push action eosio setpriv '["eosio.msig", 1]' -p eosio@active

# Init system contract
cleos push action eosio init '[0, "4,EOS"]' -p eosio@active

# Complete setup
cleos system newaccount eosio qtest ${EOSIO_PUB_KEY} ${EOSIO_PUB_KEY}  --buy-ram-kbytes 8 --stake-net "0.0000 EOS"  --stake-cpu "0.0000 EOS"