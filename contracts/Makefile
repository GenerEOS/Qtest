SHELL:= /bin/bash

APP_NAME=testcontract

CONTRACT_NAME=testcontract

clean:
	-rm -rf build

make-build-dir:
	-mkdir -p ./build

build: clean make-build-dir
	eosio-cpp ./src/${APP_NAME}.cpp -o build/${APP_NAME}.wasm  -I ./include/ -abigen_output build/${APP_NAME}.abi