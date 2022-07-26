
clean:
	-rm -rf build


build: clean
	-mkdir -p ./build
	eosio-cpp ./src/eosio.token.cpp -o build/eosio.token.wasm  -I ./include/ -abigen_output build/eosio.token.abi
