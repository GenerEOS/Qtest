WAX_CLEOS=cleos -u https://wax.greymass.com
EOS_CLEOS=cleos -u https://eos.greymass.com
TELOS_CLEOS=cleos -u https://mainnet.telos.net

ARCH=`uname -m`

get_wax: 
	mkdir -p contracts/wax && \
	$(WAX_CLEOS) get code eosio -a ./contracts/wax/eosio.system.abi
	$(WAX_CLEOS) get code eosio -c ./contracts/wax/eosio.system.wasm --wasm
	$(WAX_CLEOS) get code eosio.msig -a ./contracts/wax/eosio.msig.abi
	$(WAX_CLEOS) get code eosio.msig -c ./contracts/wax/eosio.msig.wasm --wasm

get_eos: 
	mkdir -p contracts/eos && \
	$(EOS_CLEOS) get code eosio -a ./contracts/eos/eosio.system.abi
	$(EOS_CLEOS) get code eosio -c ./contracts/eos/eosio.system.wasm --wasm
	$(EOS_CLEOS) get code eosio.msig -a ./contracts/eos/eosio.msig.abi
	$(EOS_CLEOS) get code eosio.msig -c ./contracts/eos/eosio.msig.wasm --wasm

get_telos: 
	mkdir -p contracts/telos && \
	$(TELOS_CLEOS) get code eosio -a ./contracts/telos/eosio.system.abi
	$(TELOS_CLEOS) get code eosio -c ./contracts/telos/eosio.system.wasm --wasm
	$(TELOS_CLEOS) get code eosio.msig -a ./contracts/telos/eosio.msig.abi
	$(TELOS_CLEOS) get code eosio.msig -c ./contracts/telos/eosio.msig.wasm --wasm

get_artifacts: get_wax get_eos get_telos
	$(EOS_CLEOS) get code eosio.token -a ./contracts/eosio.token/eosio.token.abi
	$(EOS_CLEOS) get code eosio.token -c ./contracts/eosio.token/eosio.token.wasm --wasm
	
build_snapshots:
	docker build -f Dockerfile.snapshot -t qsnapshot . --platform linux/${ARCH}

create_snapshots: stop
	docker run --name qsnapshot --env EOSIO_PUB_KEY=EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH --env EOSIO_PRV_KEY=5JKxAqBoQuAYSh6YMcjxcougPpt1pi9L4PyJHwEQuZgYYgkWpjS --env SYSTEM_TOKEN_SYMBOL="WAX" -d -p 8888:8888 qsnapshot:latest --platform linux/${ARCH}

copy_snapshots:
	./copy_snapshot.sh

build:
	# docker build -f Dockerfile -t genereos/qtest:amd64-v1.1.0 . --platform linux/amd64
	# docker build -f Dockerfile -t genereos/qtest:arm64-v1.1.0 . --platform linux/arm64
	# docker buildx create --use
	docker buildx build -f Dockerfile -t genereos/qtest:v1.1.0 --platform linux/amd64,linux/arm64 .
	

start: stop
	docker run --name qtest --env SYSTEM_TOKEN_SYMBOL="WAX" -d -p 8888:8888 genereos/qtest:v1.1.0

stop:
	docker container rm qtest -f
	docker container rm qsnapshot -f